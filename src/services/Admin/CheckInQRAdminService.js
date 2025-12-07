const User = require("../../models/User/User");
const CheckInQR = require("../../models/CheckInQRModel/CheckInQRModel");
const crypto = require("crypto");
const Membership = require("../../models/Membership/Membership");
const CheckInLog = require("../../models/CheckInLogModel/CheckInLogModel");

const checkInQRcreate = async ({ membershipId, memberId }) => {
  const member = await User.findById(memberId);
  if (!member) throw new Error("Member không tồn tại");

  const membership = await Membership.findById(membershipId);
  if (!membership) throw new Error("Membership không tồn tại");

  if (String(membership.userId) !== String(memberId)) {
    throw new Error("Membership không thuộc về thành viên này");
  }

  if (membership.status !== "active") {
    throw new Error("Membership không hợp lệ hoặc đã hết hạn");
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
  const qr = await CheckInQR.findOne({ hash });

  if (!qr) throw new Error("QR không tồn tại");
  if (qr.scanned) throw new Error("QR đã được sử dụng");
  if (qr.expiredAt < new Date()) throw new Error("QR đã hết hạn");

  const member = await User.findById(qr.memberId);
  const membership = await Membership.findById(qr.membershipId);

  if (!member || !membership)
    throw new Error("Member hoặc membership không tồn tại");

  if (membership.remainingSessions <= 0)
    throw new Error("Member đã hết buổi tập");

  if (membership.endDate < new Date()) throw new Error("Membership đã hết hạn");

  // ============================
  // Tạo lịch sử Check-in
  // ============================
  const log = await CheckInLog.create({
    member: qr.memberId,
    membershipId: qr.membershipId,
    qrCodeId: qr._id,
    status: "verified",
    verifiedBy: userId, // member tự quét → userId chính là member
  });

  // ============================
  // Trừ buổi tập (nếu là gói theo buổi)
  // ============================
  membership.remainingSessions -= 1;
  await membership.save();

  // ============================
  // Đánh dấu QR đã sử dụng
  // ============================
  qr.scanned = true;
  await qr.save();

  return {
    checkInLogId: log._id,
    member: {
      id: member._id,
      fullName: member.fullName,
      phone: member.phone,
    },
    membership: {
      id: membership._id,
      remainingSessions: membership.remainingSessions,
    },
  };
};

const getMembers = async () => {
  try {
    const memberships = await Membership.find({
      status: "active",
      remainingSessions: { $gt: 0 },
      endDate: { $gte: new Date() },
    })
      .populate({
        path: "userId",
        select: "fullName email phone isActive",
        match: { isActive: true },
      })
      .populate("packageId", "name durationInDays")
      .sort({ startDate: -1 });

    // Loại membership thiếu user (VD: user xóa account)
    const validMemberships = memberships.filter((m) => m.userId);

    const members = validMemberships.map((m) => ({
      membershipId: m._id,
      memberId: m.userId._id,
      fullName: m.userId.fullName,
      email: m.userId.email,
      phone: m.userId.phone,
      packageName: m.packageId.name,
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
      .populate("member", "fullName email phone")
      .populate("membershipId", "packageId")
      .populate("qrCodeId", "hash")
      .populate("verifiedBy", "fullName email")
      .sort({ date: -1 });

    const history = logs.map((log) => ({
      checkInLogId: log._id,
      member: log.member
        ? {
            id: log.member._id,
            fullName: log.member.fullName,
            email: log.member.email,
            phone: log.member.phone,
          }
        : null,
      membership: log.membershipId
        ? {
            id: log.membershipId._id,
            packageId: log.membershipId.packageId,
          }
        : null,
      date: log.date,
      qrHash: log.qrCodeId ? log.qrCodeId.hash : null,
      status: log.status,
      verifiedBy: log.verifiedBy
        ? {
            id: log.verifiedBy._id,
            fullName: log.verifiedBy.fullName,
            email: log.verifiedBy.email,
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
