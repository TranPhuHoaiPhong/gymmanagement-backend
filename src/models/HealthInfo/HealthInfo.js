const mongoose = require("mongoose");

const healthInfoSchema = new mongoose.Schema({
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  medicalHistory: { type: [String], default: [] },
  fitnessGoal: {
    type: String,
    enum: ["weight_loss", "muscle_gain", "endurance", "general"],
    default: "general"
  },
});

module.exports = healthInfoSchema;
