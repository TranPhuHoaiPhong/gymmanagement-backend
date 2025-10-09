const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },             // Tên gói
  durationInDays: { type: Number, required: true },   // Số ngày gói tập
  price: { type: Number, required: true },           // Giá tiền
  description: { type: String, default: "" },        // Mô tả gói
}, { timestamps: true });                             // createdAt & updatedAt tự sinh

const Package = mongoose.model("Package", packageSchema);

module.exports = Package;
