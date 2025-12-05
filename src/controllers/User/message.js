const MessageService = require("../../services/User/message");

class MessageController {
  static async getMessage(req, res) {
    const userId = req.userId;  
    try {
      const reviews = await MessageService.getMessage(userId);
      res.status(200).json(reviews);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = MessageController;
