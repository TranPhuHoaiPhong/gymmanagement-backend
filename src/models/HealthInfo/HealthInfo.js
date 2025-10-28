const mongoose = require("mongoose");

const healthInfoSchema = new mongoose.Schema(
  {
    height: Number, // cm
    weight: Number, // kg
    bmi: Number,
    bodyFatPercent: Number,
    muscleMass: Number,
    waterPercent: Number,
    medicalHistory: { type: [String], default: [] },
    fitnessGoal: {
      type: String,
      enum: ["weight_loss", "muscle_gain", "endurance", "general"],
      default: "general",
    },
  },
  { timestamps: true }
);

// Tự động tính BMI khi lưu
healthInfoSchema.pre("save", function (next) {
  if (this.height && this.weight) {
    const heightInMeters = this.height / 100;
    this.bmi = +(this.weight / (heightInMeters * heightInMeters)).toFixed(2);
  }
  next();
});

const HealthInfo = mongoose.model("HealthInfo", healthInfoSchema);
module.exports = HealthInfo;
