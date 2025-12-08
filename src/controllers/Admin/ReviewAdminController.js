const ReviewAdminService = require("../../services/Admin/ReviewAdminService");

const createReview = async (req, res) => {
  try {
    const { member, trainer, rating, comment, targetType } = req.body;

    if (!member || !trainer || !rating || !comment) {
      return res.status(400).json({
        status: "ERROR",
        message: "Thiếu thông tin cần thiết",
      });
    }

    const resCreate = await ReviewAdminService.createReview({
      member,
      trainer,
      rating,
      comment,
      targetType,
    });

    return res.status(200).json(resCreate);
  } catch (error) {
    console.error("Lỗi tạo Review:", error);

    if (error?.status && error?.message) {
      return res.status(400).json(error);
    }

    return res.status(500).json({
      status: "ERROR",
      message: "Lỗi máy chủ, vui lòng thử lại sau",
    });
  }
};

const getTrainerReviews = async (req, res) => {
  try {
    const { trainerId } = req.params;

    if (!trainerId) {
      return res.status(400).json({
        status: "ERROR",
        message: "Thiếu trainerId",
      });
    }

    const resGetReviews = await ReviewAdminService.getTrainerReviews(trainerId);

    return res.status(200).json(resGetReviews);
  } catch (error) {
    console.error("Lỗi lấy reviews:", error);
    if (error?.status && error?.message) {
      return res.status(400).json(error);
    }
  }
};

const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    if (!reviewId) {
      return res.status(400).json({
        status: "ERROR",
        message: "Thiếu reviewId",
      });
    }

    const resDeleteReviews = await ReviewAdminService.deleteReview(reviewId);

    return res.status(200).json(resDeleteReviews);
  } catch (error) {
    console.error("Lỗi lấy reviews:", error);
    if (error?.status && error?.message) {
      return res.status(400).json(error);
    }
  }
};

module.exports = {
  createReview,
  getTrainerReviews,
  deleteReview,
};
