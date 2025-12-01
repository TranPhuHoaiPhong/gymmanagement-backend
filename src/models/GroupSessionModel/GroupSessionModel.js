const mongoose = require("mongoose");

const groupSessionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // ví dụ: Yoga, Zumba, Boxing
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    date: { type: Date, required: true },
    startTime: String,
    endTime: String,

    location: { type: String, default: "" }, // phòng tập

    capacity: { type: Number, default: 30 },

    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },

    membersAllowed: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    membersCheckedIn: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("GroupSession", groupSessionSchema);
