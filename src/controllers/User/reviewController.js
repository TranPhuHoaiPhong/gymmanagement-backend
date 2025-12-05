const ReviewService = require("../../services/User/reviewService");

class ReviewController {
  static async getReviewsByTrainer(req, res) {
    const { trainerId } = req.params;
    try {
      const reviews = await ReviewService.getReviewsByTrainer(trainerId);
      res.status(200).json(reviews);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }

  static async createReview(req, res) {
    const { member, trainer, comment } = req.body;
    try {
      const review = await ReviewService.createReview({ member, trainer, comment });
      res.status(201).json(review);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }

  static async toggleLike(req, res) {
    const { reviewId } = req.params;
    const userId = req.body.userId;
    try {
      const review = await ReviewService.toggleLike(reviewId, userId);
      res.status(200).json(review);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }

  static async updateReview(req, res) {
    const reviewId = req.params.id;        
    const userId = req.userId;  
    const { comment } = req.body;

    try {
      const review = await ReviewService.updateReview(reviewId, userId, comment);
      if (!review.success) {
        return res.status(400).json({ msg: review.message });
      }
      res.status(200).json(review);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }

  static async deleteReview(req, res) {
    const reviewId = req.params.id;        
    const userId = req.userId;  

    try {
      const review = await ReviewService.deleteReview(reviewId, userId);
      if (!review.success) {
        return res.status(400).json({ msg: review.message });
      }
      res.status(200).json(review);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = ReviewController;
