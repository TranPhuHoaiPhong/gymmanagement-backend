const Review = require("../../models/ReviewModel/ReviewModel");
const User = require("../../models/User/User");

class ReviewService {

  static async getReviewsByTrainer(trainerId) {
    try {
      const reviews = await Review.find({
        trainer: trainerId,
        targetType: "trainer",
      })
        .populate("member", "_id fullName avatarUrl") // lấy tên + avatar
        .sort({ createdAt: -1 });

      return {
        success: true,
        count: reviews.length,
        data: reviews,
      };
    } catch (error) {
      throw error;
    }
  }

  static async createReview(data) {
    const review = new Review(data);
    await review.save();
    return review;
  }

  static async toggleLike(reviewId, userId) {
    const review = await Review.findById(reviewId);
    if (!review) throw new Error("Review not found");

    const index = review.likedBy.findIndex(id => id.toString() === userId);
    if (index >= 0) {
      // đã like → unlike
      review.likedBy.splice(index, 1);
      review.likes = Math.max(review.likes - 1, 0);
    } else {
      // like
      review.likedBy.push(userId);
      review.likes += 1;
    }

    await review.save();
    return review;
  }

  static async updateReview(reviewId, userId, comment) {
    if (!reviewId || !userId || !comment) {
      return {
        success: false,
        message: "Vui lòng điền đầy đủ thông tin",
      };
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return {
        success: false,
        message: "Review không tồn tại",
      };
    }

    if (review.member.toString() !== userId) {
      return {
        success: false,
        message: "Bạn không có quyền sửa review này",
      };
    } 

    review.comment = comment;
    await review.save();
    return {
      success: true,
      message: "Cập nhật review thành công",
      data: review,
    };
  }

  static async deleteReview(reviewId, userId) {
    if (!reviewId || !userId) {
      return {
        success: false,
        message: "Vui lòng điền đầy đủ thông tin",
      };
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return {
        success: false,
        message: "Review không tồn tại",
      };
    }

    if (review.member.toString() !== userId) {
      return {
        success: false,
        message: "Bạn không có quyền sửa review này",
      };
    } 

    await Review.findByIdAndDelete(reviewId);

    return {
      success: true,
      message: "Xóa review thành công",
    };
  }
}

module.exports = ReviewService;
