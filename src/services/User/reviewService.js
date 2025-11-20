const Review = require("../../models/ReviewModel/ReviewModel");

class ReviewService {
  // Lấy tất cả review cho trainer
  static async getReviewsByTrainer(trainerId) {
  try {
    const reviews = await Review.find({
      trainer: trainerId,
      targetType: "trainer",
    })
      .populate("member", "_id") // lấy tên + avatar
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


  // Tạo review mới
  static async createReview(data) {
    const review = new Review(data);
    await review.save();
    return review;
  }

  // Like / Unlike review
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
}

module.exports = ReviewService;
