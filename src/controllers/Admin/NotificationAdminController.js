const NotificationAdminService = require("../../services/Admin/NotificationAdminService");

const sendNotification = async (req, res) => {
  try {
    const { target, userId, userRole, type, title, message, data } = req.body;

    const response = await NotificationAdminService.sendNotification({
      target,
      userId,
      userRole,
      type,
      title,
      message,
      data,
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error("Lỗi send notification:", error);
    return res.status(500).json({
      status: "ERROR",
      message: "Lỗi máy chủ, vui lòng thử lại sau",
    });
  }
};

const getAllNotification = async (req, res) => {
  try {
    const response = await NotificationAdminService.getAllNotification();

    return res.status(200).json(response);
  } catch (error) {
    console.error("Lỗi lấy tất cả notification:", error);
    return res.status(500).json({
      status: "ERROR",
      message: "Lỗi máy chủ, vui lòng thử lại sau",
    });
  }
};

module.exports = {
  sendNotification,
  getAllNotification,
};
