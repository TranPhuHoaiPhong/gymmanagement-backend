const Package = require("../../models/Package/package");
const Membership = require("../../models/Membership/Membership");

class memberCheckService {

  static async memcheckservice(userId) {
    try {
      // Lấy tất cả membership active của user
      const activeMemberships = await Membership.find({
        userId,
        status: "active",
      });

      if (!activeMemberships || activeMemberships.length === 0) {
        return {
          success: true,
          data: null, // không có membership active
        };
      }

      // Trả về danh sách packageId và status
      const data = activeMemberships.map((m) => ({
        packageId: m.packageId.toString(),
        status: m.status,
      }));

      return {
        success: true,
        data,
      };
    } catch (e) {
      console.error("Lỗi trong memcheckservice:", e);
      return {
        success: false,
        message: "Lỗi máy chủ khi kiểm tra membership",
      };
    }
  }
}

module.exports = memberCheckService;
