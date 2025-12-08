const Membership = require("../../models/Membership/Membership");
const Package = require("../../models/Package/package");
const User = require("../../models/User/User");
const Notification = require("../../models/Notification/Notification");

const createNotification = async ({
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

    // --- 2. Gửi cho nhóm (member / trainer) ---
    if (target === "group") {
      if (!["member", "trainer"].includes(userRole)) {
        return { status: "ERROR", message: "userRole không hợp lệ" };
      }

      const users = await User.find({ role: userRole, isActive: true });
      userList = users.map((u) => u._id);
    }

    // --- 3. Gửi cho toàn bộ người dùng ---
    if (target === "all") {
      const allUsers = await User.find({ isActive: true });
      userList = allUsers.map((u) => u._id);
    }

    if (userList.length === 0)
      return { status: "ERROR", message: "Không tìm thấy user phù hợp" };

    // --- 4. Chuẩn bị data ---
    const notifications = userList.map((uid) => ({
      userId: uid,
      type,
      title,
      message,
      data: data || {},
      target: "single", // luôn single vì mỗi user là 1 thông báo riêng
    }));

    // --- 5. Lưu vào DB ---
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
  createNotification,
  getAllNotification,
};
