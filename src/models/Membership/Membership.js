const mongoose = require("mongoose");

const membershipSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // ai sở hữu
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // nếu là gói PT
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    renewalCount: { type: Number, default: 0 },
    remainingSessions: { type: Number, default: 0 },
    autoRenew: { type: Boolean, default: false },
    notificationSent: { type: Boolean, default: false },

    status: {
      type: String,
      enum: ["active", "expired", "pending"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Membership = mongoose.model("Membership", membershipSchema);
module.exports = Membership;
