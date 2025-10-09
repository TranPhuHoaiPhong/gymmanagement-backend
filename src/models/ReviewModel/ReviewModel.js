const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  member: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: "Trainer" },
  rating: { type: Number, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Review", reviewSchema);