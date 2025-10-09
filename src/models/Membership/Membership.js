const mongoose = require("mongoose");

const membershipSchema = new mongoose.Schema({
  packageId: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
  startDate: { type: Date },
  endDate: { type: Date }, // 🔧 sửa lỗi chính tả "enđDate"
  status: {
    type: String,
    enum: ["active", "expired", "paused"],
    default: "active"
  },
});

module.exports = membershipSchema;
