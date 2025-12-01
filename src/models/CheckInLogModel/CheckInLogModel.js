const mongoose = require("mongoose");

const checkInLogSchema = new mongoose.Schema({
  member: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  membershipId: { type: mongoose.Schema.Types.ObjectId, ref: "Membership" },

  sessionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  sessionType: { type: String, enum: ["group", "trainer"], required: true },

  time: { type: Date, default: Date.now },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  qrCodeId: { type: String },

  status: {
    type: String,
    enum: ["pending", "verified", "failed", "expired", "duplicate"],
    default: "verified",
  },

  device: { type: String },
  location: { type: String },
});

module.exports = mongoose.model("CheckInLog", checkInLogSchema);
