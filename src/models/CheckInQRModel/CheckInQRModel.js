const mongoose = require("mongoose");

const checkInQRSchema = new mongoose.Schema(
  {
    membershipId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Membership",
    },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    qrCode: String, // base64 hoặc URL QR
    hash: String, // token bảo mật
    expiredAt: Date,
    scanned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CheckInQR", checkInQRSchema);
