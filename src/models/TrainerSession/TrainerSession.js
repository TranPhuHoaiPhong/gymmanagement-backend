const mongoose = require("mongoose");

const trainerSessionSchema = new mongoose.Schema(
  {
    membershipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
      required: true,
    },
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sessionDate: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TrainerSession", trainerSessionSchema);
