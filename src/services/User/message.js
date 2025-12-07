const Message = require("../../models/Message/Message");

class MessageService {

  static async getMessage(userId) {
  try {
    const result = await Message.find({
      $or: [
        { from: userId },
        { to: userId }
      ]
    }).sort({ timestamp: 1 }); // có thể sắp xếp theo thời gian

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    throw error;
  }
}


  static async getAllMessage() {
  try {
    // Lấy tất cả message, loại bỏ from = adminId
    const adminId = "68ff36d578fc9208ee291a83"; 
    const result = await Message.find({ from: { $ne: adminId } });

    // Đếm số lần xuất hiện của từng 'from'
    const countFrom = {};
    result.forEach(item => {
      const fromId = item.from.toString();
      if (countFrom[fromId]) {
        countFrom[fromId]++;
      } else {
        countFrom[fromId] = 1;
      }
    });

    console.log("Kết quả đếm từ 'from' (bỏ admin):", countFrom);

    return {
      success: true,
      data: result,
      countFrom,
    };
  } catch (error) {
    throw error;
  }
}


  
}

module.exports = MessageService;
