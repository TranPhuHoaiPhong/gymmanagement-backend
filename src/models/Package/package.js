const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    durationInDays: { type: Number, required: true },
    price: { type: Number, required: true },
    description: { type: String, default: "" },
    type: {
      type: String,
      enum: ["standard", "personal_trainer"],
      default: "standard",
    },
    sessionsWithTrainer: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Package = mongoose.model("Package", packageSchema);

module.exports = Package;
