const Membership = require("../../models/Membership/Membership");
const Package = require("../../models/Package/package");
const User = require("../../models/User/User");
const Notification = require("../../models/Notification/Notification");

const sendNotification = async ({
  target,
  userId,
  userRole,
  type,
  title,
  message,
  data,
}) => {
  try {
    let userList = [];

    // --- 1. Gửi cho 1 người ---
    if (target === "single") {
      if (!userId) return { status: "ERROR", message: "Thiếu userId" };

      userList = [userId];
    }

    // --- 2. Gửi cho nhóm (theo role) ---
    if (target === "group") {
      if (!userRole)
        return { status: "ERROR", message: "Thiếu userRole (member/trainer)" };

      const users = await User.find({ role: userRole });
      userList = users.map((u) => u._id);
    }

    // --- 3. Gửi cho tất cả người dùng ---
    if (target === "all") {
      const allUsers = await User.find({});
      userList = allUsers.map((u) => u._id);
    }

    if (userList.length === 0)
      return { status: "ERROR", message: "Không tìm thấy user phù hợp" };

    // --- 4. Chuẩn bị dữ liệu thông báo ---
    const notifications = userList.map((uid) => ({
      userId: uid,
      type,
      title,
      message,
      data: data || {},
      target,
    }));

    // --- 5. Lưu hàng loạt vào DB ---
    await Notification.insertMany(notifications);

    return {
      status: "OK",
      message: `Đã gửi ${notifications.length} thông báo`,
      count: notifications.length,
    };
  } catch (error) {
    console.error("Service sendNotification error:", error);
    throw error;
  }
};

const getAllNotification = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const getAllNotifications = await Notification.find();
      resolve({
        status: "OK",
        message: "Lấy tất cả thành công",
        data: getAllNotifications,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  sendNotification,
  getAllNotification,
};
