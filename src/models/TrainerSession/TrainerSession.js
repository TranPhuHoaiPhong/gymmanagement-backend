const trainerSessionSchema = new mongoose.Schema({
  membershipId: { type: mongoose.Schema.Types.ObjectId, ref: "Membership", required: true },
  trainerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sessionDate: { type: Date, required: true },
  status: { type: String, enum: ["scheduled", "completed", "missed"], default: "scheduled" },
}, { timestamps: true });

module.exports = mongoose.model("TrainerSession", trainerSessionSchema);
