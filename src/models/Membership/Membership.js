const membershipSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: "Package", required: true },
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // nếu là PT

    startDate: { type: Date, required: true, default: Date.now },
    endDate: { type: Date },
    renewalCount: { type: Number, default: 0, min: 0 },
    remainingSessions: { type: Number, default: 0, min: 0 },
    autoRenew: { type: Boolean, default: false },
    notificationSent: { type: Boolean, default: false },

    status: {
      type: String,
      enum: ["pending", "active", "expired", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Tự động tính endDate dựa vào package
membershipSchema.pre("save", async function (next) {
  if (!this.endDate && this.packageId) {
    const Package = mongoose.model("Package");
    const pkg = await Package.findById(this.packageId);
    if (pkg) {
      const end = new Date(this.startDate);
      end.setDate(end.getDate() + pkg.durationInDays);
      this.endDate = end;
      // Nếu có PT sessions thì set remainingSessions
      if (pkg.type === "personal_trainer") {
        this.remainingSessions = pkg.sessionsWithTrainer;
      }
    }
  }
  next();
});
const Membership = mongoose.model("Membership", membershipSchema);

module.exports = Membership;