const mongoose = require("mongoose");
const healthInfoSchema = require("../HealthInfo/HealthInfo");
const membershipSchema = require("../Membership/Membership");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ["male", "female", "other"], required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  avatarUrl: { type: String, default: "" },
  healthInfo: { type: healthInfoSchema, default: () => ({}) },
  membership: { type: membershipSchema, default: () => ({}) },
  role: {
    type: String,
    enum: ["admin", "staff", "member", "trainer"],
    default: "member",
  },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;
