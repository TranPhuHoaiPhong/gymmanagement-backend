const User = require("../../models/User/User")

class userService {

  static async user(userId, avatarUrl) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return { success: false, message: "Người dùng không tồn tại" };
      }

      console.log("avatarUrl", avatarUrl);
      user.avatarUrl = avatarUrl; // cập nhật avatar
      await user.save();

      return { success: true, data: { avatarUrl: user.avatarUrl } };

    } catch (e) {
      console.error("Lỗi trong memcheckservice:", e);
      return {
        success: false,
        message: "Lỗi máy chủ khi kiểm tra membership",
      };
    }
  }

  static async detailUser(userId) {
    try {
      const user = await User.findById(userId).select('-password -__v');
      
      if (!user) {
        return { 
          success: false, 
          message: "Người dùng không tồn tại" 
        };
      }

      return { 
        success: true, 
        data: user 
      };

    } catch (e) {
      console.error("Lỗi khi lấy thông tin user:", e);
      return {
        success: false,
        message: "Lỗi máy chủ khi lấy thông tin user",
      };
    }
  }
}

module.exports = userService;
