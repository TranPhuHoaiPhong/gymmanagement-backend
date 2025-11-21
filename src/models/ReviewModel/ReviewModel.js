const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    member: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    }, // Người viết bình luận

    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Trainer được đánh giá

    rating: { 
      type: Number, 
      min: 0, 
      max: 5, 
      default: 0 
    }, // Điểm đánh giá 1-5

    comment: { 
      type: String, 
      required: true 
    }, // Nội dung bình luận

    likes: { 
      type: Number, 
      default: 0 
    }, // Số lượt thích

    likedBy: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    }], // Danh sách user đã like

    targetType: {
      type: String,
      enum: ["trainer", "workout"],
      default: "trainer",
    }, // Loại đối tượng đánh giá

    createdAt: { 
      type: Date, 
      default: Date.now 
    },
  },
  {
    timestamps: true, // Tạo auto createdAt & updatedAt
  }
);

module.exports = mongoose.model("Review", reviewSchema);
