const User = require("../../models/User/User");
const CheckInQR = require("../../models/CheckInQRModel/CheckInQRModel");
const crypto = require("crypto");
const Membership = require("../../models/Membership/Membership");
const CheckInLog = require("../../models/CheckInLogModel/CheckInLogModel");
const TrainerSession = require("../../models/TrainerSession/TrainerSession");

const checkInQRcreate = async ({ membershipId, memberId }) => {
  const member = await User.findById(memberId);
  if (!member) throw new Error("Member không tồn tại");

  const membership = await Membership.findById(membershipId);
  if (!membership) throw new Error("Membership không tồn tại");

  if (String(membership.userId) !== String(memberId)) {
    throw new Error("Membership không thuộc về member này");
  }

  if (membership.status !== "active") {
    throw new Error("Membership không hợp lệ hoặc hết hạn");
  }

  // Xoá QR cũ chưa dùng
  await CheckInQR.updateMany(
    { memberId, scanned: false, expiredAt: { $gt: new Date() } },
    { $set: { expiredAt: new Date(), scanned: true } }
  );

  const hash = crypto.randomBytes(24).toString("hex");
  const expiredAt = new Date(Date.now() + 10 * 60 * 1000);

  const qr = await CheckInQR.create({
    membershipId,
    memberId,
    hash,
    expiredAt,
    scanned: false,
  });

  return {
    qrId: qr._id,
    hash: qr.hash,
    expiredAt: qr.expiredAt,
  };
};

const verifyQR = async (hash, userId) => {
  // ========================================
  // 1. Tìm đúng QR
  // ========================================
  const qr = await CheckInQR.findOne({ hash, memberId: userId });
  if (!qr) throw new Error("QR không hợp lệ hoặc không thuộc về bạn");

  if (qr.scanned) throw new Error("QR đã được sử dụng");
  if (qr.expiredAt < new Date()) throw new Error("QR đã hết hạn");

  // ========================================
  // 2. Kiểm tra membership
  // ========================================
  const membership = await Membership.findById(qr.membershipId);
  if (!membership) throw new Error("Membership không tồn tại");

  if (membership.status !== "active")
    throw new Error("Membership không còn hiệu lực");

  if (membership.endDate < new Date()) throw new Error("Membership đã hết hạn");

  if (membership.type === "session" && membership.remainingSessions <= 0)
    throw new Error("Bạn đã hết buổi trong membership");

  // ========================================
  // 3. Chặn check-in 2 lần cùng ngày
  // ========================================
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const checkToday = await CheckInLog.findOne({
    member: userId,
    membershipId: membership._id,
    date: { $gte: startOfDay },
  });

  if (checkToday) throw new Error("Bạn đã check-in hôm nay rồi");

  // ========================================
  // 4. Tạo CheckInLog
  // ========================================
  const log = await CheckInLog.create({
    member: userId,
    membershipId: membership._id,
    qrCodeId: qr._id,
    status: "verified",
    verifiedBy: null,
  });

  // ========================================
  // 5. Tạo TrainerSession (nếu membership có trainer)
  // ========================================
  let trainerSession = null;

  if (membership.trainerId) {
    trainerSession = await TrainerSession.create({
      membershipId: membership._id,
      trainerId: membership.trainerId,
      userId: userId,
      sessionDate: new Date(),
    });
  }

  // ========================================
  // 6. Trừ buổi nếu là gói theo buổi
  // ========================================
  if (membership.type === "session") {
    membership.remainingSessions -= 1;
  }

  // ========================================
  // 7. Lưu vào membership.checkInDates
  // ========================================
  membership.checkInDates.push({
    date: new Date(),
    sessionId: trainerSession ? trainerSession._id : log._id,
    sessionType: membership.trainerId ? "trainer" : "group",
  });

  await membership.save();

  // ========================================
  // 8. Đánh dấu QR đã sử dụng
  // ========================================
  qr.scanned = true;
  await qr.save();

  // ========================================
  // 9. Trả kết quả
  // ========================================
  return {
    message: "Check-in thành công",
    data: {
      checkInLogId: log._id,
      member: {
        id: userId,
        fullName: membership.fullName,
      },
      membership: {
        id: membership._id,
        remainingSessions: membership.remainingSessions,
        type: membership.type,
        lastCheckIn: new Date(),
      },
    },
  };
};

const getMembers = async () => {
  try {
    const memberships = await Membership.find({
      status: "active",
      endDate: { $gte: new Date() },
    })
      .populate({
        path: "userId",
        select: "fullName email phone avatarUrl isActive",
        match: { isActive: true },
      })
      .populate("packageId", "name type sessionsWithTrainer durationInDays")
      .populate("trainerId", "fullName avatarUrl")
      .sort({ startDate: -1 });

    // Loại membership thiếu user
    const validMemberships = memberships.filter((m) => m.userId);

    const members = validMemberships
      .filter((m) => {
        // Nếu là gói PT → phải còn buổi
        if (m.packageId.type === "personal_trainer") {
          return m.remainingSessions > 0;
        }
        // Nếu là gói thường → không check remainingSessions
        return true;
      })
      .map((m) => ({
        membershipId: m._id,
        memberId: m.userId._id,

        fullName: m.userId.fullName,
        email: m.userId.email,
        phone: m.userId.phone,
        avatarUrl: m.userId.avatarUrl,

        package: {
          id: m.packageId._id,
          name: m.packageId.name,
          type: m.packageId.type,
          durationInDays: m.packageId.durationInDays,
        },

        trainer: m.trainerId
          ? {
              id: m.trainerId._id,
              fullName: m.trainerId.fullName,
              avatarUrl: m.trainerId.avatarUrl,
            }
          : null,

        remainingSessions: m.remainingSessions,
        startDate: m.startDate,
        endDate: m.endDate,
      }));

    return {
      status: "OK",
      message: "Lấy danh sách members thành công",
      data: members,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllCheckInHistory = async () => {
  try {
    const logs = await CheckInLog.find()
      .populate("member", "fullName email phone avatarUrl")
      .populate({
        path: "membershipId",
        populate: [
          {
            path: "packageId",
            select: "name type durationInDays price",
          },
          {
            path: "trainerId",
            select: "fullName avatarUrl",
          },
        ],
      })
      .populate("qrCodeId", "hash expiredAt")
      .populate("verifiedBy", "fullName email role")
      .sort({ createdAt: -1 });

    // Format dữ liệu trả về
    const history = logs.map((log) => ({
      checkInLogId: log._id,

      member: log.member
        ? {
            id: log.member._id,
            fullName: log.member.fullName,
            email: log.member.email,
            phone: log.member.phone,
            avatarUrl: log.member.avatarUrl,
          }
        : null,

      membership: log.membershipId
        ? {
            id: log.membershipId._id,
            package: log.membershipId.packageId
              ? {
                  id: log.membershipId.packageId._id,
                  name: log.membershipId.packageId.name,
                  type: log.membershipId.packageId.type,
                  durationInDays: log.membershipId.packageId.durationInDays,
                }
              : null,
            trainer: log.membershipId.trainerId
              ? {
                  id: log.membershipId.trainerId._id,
                  fullName: log.membershipId.trainerId.fullName,
                  avatarUrl: log.membershipId.trainerId.avatarUrl,
                }
              : null,
          }
        : null,

      qr: log.qrCodeId
        ? {
            id: log.qrCodeId._id,
            hash: log.qrCodeId.hash,
            expiredAt: log.qrCodeId.expiredAt,
          }
        : null,

      date: log.date,
      status: log.status,

      verifiedBy: log.verifiedBy
        ? {
            id: log.verifiedBy._id,
            fullName: log.verifiedBy.fullName,
            email: log.verifiedBy.email,
            role: log.verifiedBy.role,
          }
        : null,
    }));

    return {
      status: "OK",
      message: "Lấy lịch sử check-in thành công",
      data: history,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  checkInQRcreate,
  getMembers,
  verifyQR,
  getAllCheckInHistory,
};
