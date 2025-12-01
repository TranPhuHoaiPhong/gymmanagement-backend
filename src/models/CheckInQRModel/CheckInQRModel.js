const checkInQRSchema = new mongoose.Schema(
  {
    sessionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    qrCode: String, // URL hoặc base64
    hash: String, // token bảo mật
    expiredAt: Date, // thời gian hết hạn (ví dụ: sau 30 phút)

    scanned: { type: Boolean, default: false }, // tránh quét lại
  },
  { timestamps: true }
);

module.exports = mongoose.model("CheckInQR", checkInQRSchema);
