const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: { type: Number, required: true },
  reps: { type: Number, required: true },
  weight: { type: Number, default: 0 } // kg, tuỳ môn
});

const workoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  trainerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional
  date: { type: Date, required: true },
  time: { type: String, required: true }, // ví dụ "08:30"
  exercises: { type: [exerciseSchema], default: [] },
  notes: { type: String, default: "" }
}, { timestamps: true }); // tự tạo createdAt & updatedAt

const Workout = mongoose.model("Workout", workoutSchema);

module.exports = Workout;
