const NotificationService = require("../../services/User/notification");


class getNofController {
  static async getNofControler(req, res) {
    const userId = req.userId;

    try {
      const getNof = await NotificationService.getNof(userId)
      if (!getNof.success) {
        return res.status(400).json({ msg: getNof.message });
      }
      res.status(200).json(getNof);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }

  static async UpdateNofControler(req, res) {
    const userId = req.userId;

    try {
      const getNof = await NotificationService.updateIsreadNofi(userId)
      if (!getNof.success) {
        return res.status(400).json({ msg: getNof.message });
      }
      res.status(200).json(getNof);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = getNofController;
