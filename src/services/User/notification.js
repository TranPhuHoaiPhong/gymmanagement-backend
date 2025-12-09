const Notification = require("../../models/Notification/Notification");

class NotificationService {

  static async getNof(userId) {
    try {
      const nof = await Notification.find({
        $or: [
          { target: "all" },                  // thông báo cho toàn bộ người dùng
          { userId: userId, target: "single" } // thông báo riêng cho user
        ]
      })
      .sort({ createdAt: -1 });

      if (!nof || nof.length === 0) {
        return {
          success: true,
          message: "Không có thông báo nào",
          data: []
        };
      }

      console.log("nof", nof);

      return {
        success: true,
        data: nof
      };

    } catch (e) {
      console.error("Error getNof:", e);
      return {
        success: false,
        message: "Lỗi khi lấy thông báo"
      };
    }
  }
}

module.exports = NotificationService;
