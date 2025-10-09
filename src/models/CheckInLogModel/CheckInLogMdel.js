const mongoose = require("mongoose");

const checkInLogSchema = new mongoose.Schema({
  member: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  time: { type: Date, default: Date.now },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // nhân viên xác nhận
  qrCodeId: { type: String }, // mã QR để kiểm tra
});

module.exports = mongoose.model("CheckInLog", checkInLogSchema);