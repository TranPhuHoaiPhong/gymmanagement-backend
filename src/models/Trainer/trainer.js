const mongoose = require("mongoose");

const trainerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  specialization: { type: [String], default: [] }, // ví dụ: ["strength", "yoga"]
  avatarUrl: { type: String, default: "" },
  rating: { type: Number, default: 0 } // điểm đánh giá
}, { timestamps: true }); // tự tạo createdAt & updatedAt

const Trainer = mongoose.model("Trainer", trainerSchema);

module.exports = Trainer;
