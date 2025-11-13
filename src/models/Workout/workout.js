const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional
    date: { type: Date, required: true },
    time: { type: String, required: true }, // ví dụ "08:30"
    notes: { type: String, default: "" },
    title: { type: String, required: true }, // ví dụ: "Lớp Yoga sáng"
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    maxParticipants: { type: Number, default: 20 },
    currentParticipants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ],
    location: { type: String },
    membershipId: { type: mongoose.Schema.Types.ObjectId, ref: "Membership" },
    status: {
      type: String,
      enum: ["upcoming", "completed", "cancelled"],
      default: "upcoming",
    },
  },
  { timestamps: true }
); // tự tạo createdAt & updatedAt

const Workout =
  mongoose.models.Workout || mongoose.model("Workout", workoutSchema);

module.exports = Workout;
