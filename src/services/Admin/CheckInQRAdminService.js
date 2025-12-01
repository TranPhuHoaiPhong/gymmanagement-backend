// const TrainerSession = require("../../models/TrainerSession/TrainerSession");
// const GroupSession = require("../../models/GroupSessionModel/GroupSessionModel");
const User = require("../../models/User/User");
const CheckInQR = require("../../models/CheckInQRModel/CheckInQRModel");
const crypto = require("crypto");
const Membership = require("../../models/Membership/Membership");
// const Package = require("../../models/Package/Package");

const checkInQRcreate = async ({ membershipId, memberId }) => {
  try {
    // 🔹 Kiểm tra member tồn tại
    const member = await User.findById(memberId);
    if (!member) throw new Error("Member không tồn tại");

    // 🔹 Tạo hash ngẫu nhiên để bảo mật
    const hash = crypto.randomBytes(16).toString("hex");

    // 🔹 Thời gian hết hạn QR (30 phút)
    const expiredAt = new Date(Date.now() + 30 * 60 * 1000);

    // 🔹 Tạo QR
    const qr = await CheckInQR.create({
      membershipId,
      memberId,
      qrCode: "", // frontend có thể render QR từ hash
      hash,
      expiredAt,
      scanned: false,
    });

    return qr; // trả về QR vừa tạo
  } catch (error) {
    console.error("Lỗi trong checkInQRcreate:", error.message);
    throw new Error(error.message || "Lỗi máy chủ khi tạo CheckInQR");
  }
};

const getMembers = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // Lấy các membership còn active, còn buổi và gói còn hạn
      const memberships = await Membership.find({
        status: "active",
        remainingSessions: { $gt: 0 },
        endDate: { $gte: new Date() },
      })
        .populate("userId", "fullName email phone")
        .populate("packageId", "name durationInDays")
        .sort({ startDate: -1 });

      // Map ra data dễ dùng cho frontend
      const members = memberships.map((m) => ({
        membershipId: m._id, // thêm membershipId để tạo QR
        memberId: m.userId._id,
        fullName: m.userId.fullName,
        email: m.userId.email,
        phone: m.userId.phone,
        packageName: m.packageId.name,
        remainingSessions: m.remainingSessions,
        startDate: m.startDate,
        endDate: m.endDate,
      }));

      resolve({
        status: "OK",
        message: "Lấy danh sách members thành công",
        data: members,
      });
    } catch (error) {
      console.error("Lỗi trong getMembers:", error.message);
      reject({
        status: "ERROR",
        message: error.message || "Lỗi máy chủ khi lấy danh sách members",
      });
    }
  });
};

module.exports = {
  checkInQRcreate,
  getMembers,
};
