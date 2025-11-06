const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    // 🧍 Người nhận thông báo
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🎯 Loại thông báo
    type: {
      type: String,
      enum: ["purchase", "reminder", "deal", "trainer_message"],
      required: true,
    },

    // 📝 Tiêu đề và nội dung
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },

    // 📦 Dữ liệu phụ (tuỳ từng loại)
    // Ví dụ: { packageId, trainerId, discountCode }
    data: {
      type: Object,
      default: {},
    },

    // 📬 Đã đọc chưa
    isRead: {
      type: Boolean,
      default: false,
    },

    // 📌 Gửi cho ai: 1 người, nhiều người, hay toàn bộ
    target: {
      type: String,
      enum: ["single", "group", "all"],
      default: "single",
    },
  },
  {
    timestamps: true, // tự tạo createdAt và updatedAt
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
