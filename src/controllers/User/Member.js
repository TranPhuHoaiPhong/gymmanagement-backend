const memberCheckService = require("../../services/User/member");

class MemberCheckController {
  static async memberavalable(req, res) {
    const userId = req.userId;
    
    try {
      const member = await memberCheckService.memcheckservice(userId);
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

module.exports = MemberCheckController;
