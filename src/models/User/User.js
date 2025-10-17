const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    phone: {
      type: String,
      required: true,
    },
    passwordHash: { type: String, required: true },
    avatarUrl: { type: String, default: "" },

    // Dữ liệu cho member
    healthInfo: { type: mongoose.Schema.Types.ObjectId, ref: "HealthInfo" },
    membership: { type: mongoose.Schema.Types.ObjectId, ref: "Membership" },

    // Dữ liệu cho trainer
    trainerProfile: {
      specialty: String,
      experienceYears: Number,
      certifications: [String],
      bio: String,
      ratingAverage: { type: Number, default: 0 },
    },

    role: {
      type: String,
      enum: ["admin", "staff", "member", "trainer"],
      default: "member",
    },
    isAdmin: { type: Boolean, default: false },
    isStaff: { type: Boolean, default: false },
    isTrainer: { type: Boolean, default: false },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
