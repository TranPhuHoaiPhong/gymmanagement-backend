const userService = require("../../services/User/user");


class UserController {
  static async updateUser(req, res) {
    const userId = req.userId;
    if (!req.file) {
        return res.status(400).json({ success: false, message: "Không có file ảnh!" });
    }
    const avatarUrl = `/images/avatar/${req.file.filename}`; 
    
    try {
      const member = await userService.user(userId, avatarUrl)
      if (!member.success) {
        return res.status(400).json({ msg: member.message });
      }
      res.status(200).json(member);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }

  static async detailUser(req, res) {
    const userId = req.userId;

    try {
      const member = await userService.detailUser(userId)
      if (!member.success) {
        return res.status(400).json({ msg: member.message });
      }
      res.status(200).json(member);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = UserController;
