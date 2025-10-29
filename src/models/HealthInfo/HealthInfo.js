const mongoose = require("mongoose");

const healthInfoSchema = new mongoose.Schema(
  {
    height: Number, // cm
    weight: Number, // kg
    bmi: Number,    // tính tự động
    medicalHistory: { type: [String], default: [] },
    fitnessGoal: {
      type: String,
      enum: [
        "weight_loss",
        "muscle_gain",
        "endurance",
        "general_health",
        "fat_loss",
        "flexibility",
        "recovery",
        "stress_relief",
        "strength_training",
        "athletic_performance"
      ],
      default: "general_health",
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
