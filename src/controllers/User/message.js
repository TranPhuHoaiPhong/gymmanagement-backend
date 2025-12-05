const MessageService = require("../../services/User/message");

class MessageController {
  static async getMessage(req, res) {
    const userId = req.params.id;
 
    try {
      const reviews = await MessageService.getMessage(userId);
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
