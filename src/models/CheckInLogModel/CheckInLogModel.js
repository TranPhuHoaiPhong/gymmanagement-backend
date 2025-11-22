const mongoose = require("mongoose");

const checkInLogSchema = new mongoose.Schema({
  member: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  time: { type: Date, default: Date.now },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // nhân viên xác nhận
  qrCodeId: { type: String }, // mã QR để kiểm tra
  status: { type: String, enum: ["pending", "verified"], default: "verified" },
  device: { type: String },
  location: { type: String },
  membershipId: { type: mongoose.Schema.Types.ObjectId, ref: "Membership" },
});

module.exports = mongoose.model("CheckInLog", checkInLogSchema);
