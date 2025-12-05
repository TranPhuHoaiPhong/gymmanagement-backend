const Message = require("../../models/Message/Message");

class MessageService {

  static async getMessage(userId) {
    try {
      const result = await Message.find({
        from: userId,
      })

      console.log("Message", result);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }

  
}

module.exports = MessageService;
