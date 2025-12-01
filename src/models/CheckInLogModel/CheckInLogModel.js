const mongoose = require("mongoose");

const checkInLogSchema = new mongoose.Schema({
  member: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  membershipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Membership",
    required: true,
  },
  date: { type: Date, default: Date.now }, // ngày check-in
  qrCodeId: { type: mongoose.Schema.Types.ObjectId, ref: "CheckInQR" },
  status: {
    type: String,
    enum: ["pending", "verified", "failed", "expired", "duplicate"],
    default: "verified",
  },
  device: { type: String },
  location: { type: String },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("CheckInLog", checkInLogSchema);
