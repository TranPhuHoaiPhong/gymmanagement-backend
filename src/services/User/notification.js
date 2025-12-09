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

  static async updateIsreadNofi(userId) {
    try {
      await Notification.updateMany(
        {
          $or: [
            { target: "all" }, 
            { userId: userId, target: "single" }
          ]
        },
        { $set: { isRead: true } }
      );

      // Lấy lại danh sách sau khi cập nhật
      const nof = await Notification.find({
        $or: [
          { target: "all" },
          { userId: userId, target: "single" }
        ]
      }).sort({ createdAt: -1 });

      return {
        success: true,
        data: nof
      };
    } catch (e) {
      console.error("Error updateIsreadNofi:", e);
      return {
        success: false,
        message: "Lỗi khi lấy thông báo"
      };
    }
  }

}

module.exports = NotificationService;
