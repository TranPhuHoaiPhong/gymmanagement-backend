const MessageService = require("../../services/User/message");

class MessageController {
  static async getMessage(req, res) {
    const userId = req.params.id;
    console.log("userId", userId);
 
    try {
      const reviews = await MessageService.getMessage(userId);
      res.status(200).json(reviews);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }

  static async getMessageById(req, res) {
    const toId = req.params.id;
    const userId = req.query.userId; 
 
    try {
      const reviews = await MessageService.getMessageById(userId, toId);
      res.status(200).json(reviews);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }

  static async getAllMessage(req, res) {
    try {
      const reviews = await MessageService.getAllMessage();
      res.status(200).json(reviews);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = MessageController;
