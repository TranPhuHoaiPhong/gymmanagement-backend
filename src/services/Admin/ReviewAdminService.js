const User = require("../../models/User/User");
const Review = require("../../models/ReviewModel/ReviewModel");

const createReview = (newReview) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { member, trainer, rating, comment, targetType } = newReview;

      const checkMember = await User.findById(member);
      if (!checkMember || checkMember.role !== "member") {
        return resolve({
          status: "ERROR",
          message: "Thành viên không tồn tại hoặc không phải là member.",
        });
      }

      const checkTrainer = await User.findById(trainer);
      if (!checkTrainer || checkTrainer.role !== "trainer") {
        return resolve({
          status: "ERROR",
          message: "Trainer không hợp lệ.",
        });
      }

      if (!rating || rating < 1 || rating > 5) {
        return resolve({
          status: "ERROR",
          message: "Rating phải từ 1 đến 5.",
        });
      }

      if (!["trainer", "workout"].includes(targetType)) {
        return resolve({
          status: "ERROR",
          message: "targetType chỉ có thể là 'trainer' hoặc 'workout'.",
        });
      }

      // Tạo review
      const createdReview = await Review.create({
        member,
        trainer,
        rating,
        comment,
        targetType,
      });

      resolve({
        status: "OK",
        message: "Tạo Review thành công.",
        data: createdReview,
      });
    } catch (error) {
      console.error("Lỗi trong createReview:", error);
      reject({
        status: "ERROR",
        message: "Lỗi máy chủ khi tạo Review.",
      });
    }
  });
};

module.exports = {
  createReview,
};
