const { Schema, model } = require("mongoose");

const messageSchema = new Schema({
  from: { type: String, required: true }, // userId
  to: { type: String, required: true }, // userId
  text: { type: String, required: true },
  senderRole: { type: String, enum: ["member", "admin"], default: "member" },
  timestamp: { type: Date, default: Date.now },
});

const Message = model("Message", messageSchema);
module.exports = Message;
