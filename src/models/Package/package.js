const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    durationInDays: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, default: "" },
    type: {
      type: String,
      enum: ["standard", "personal_trainer"],
      default: "standard",
    },
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    sessionsWithTrainer: { type: Number, default: 0, min : 0 },
    maxMembers: { type: Number, default: 30 },
    registeredCount: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Package = mongoose.model("Package", packageSchema);

module.exports = Package;
