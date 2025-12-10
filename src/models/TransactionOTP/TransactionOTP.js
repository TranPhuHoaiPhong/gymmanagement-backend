const mongoose = require("mongoose");

const transactionOTPSchema = new mongoose.Schema(
  {
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    otp: String,
    transactionData: Object,
    expireAt: { type: Date, expires: 300 }, // Hết hạn sau 5 phút
  },
  { timestamps: true }
);

module.exports = mongoose.model("TransactionOTP", transactionOTPSchema);
