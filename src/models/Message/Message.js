const { Schema, model } = require("mongoose");

const messageSchema = new Schema({
  from: { type: String, required: true }, // member gửi
  to: { type: String, required: true }, // admin nhận
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Message = model("Message", messageSchema);
module.exports = Message;
