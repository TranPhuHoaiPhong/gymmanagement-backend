const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },
    membershipId: { type: mongoose.Schema.Types.ObjectId, ref: "Membership" },
    transactionCode: {
      type: String,
      unique: true,
      default: () => `TXN-${Date.now()}`,
    },

    amount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "momo", "paypal", "bank_transfer", "other"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    transactionDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
); // tự tạo createdAt & updatedAt

const Transaction =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
