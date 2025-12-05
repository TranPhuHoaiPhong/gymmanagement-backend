const express = require("express");
const router = express.Router();
const authController = require("../../controllers/User/authController");
const healthInfo = require("../../controllers/User/healthInfo");
const { authUserApp } = require("../../middlewares/authMiddleware/authMiddleware");
const ReviewController = require("../../controllers/User/reviewController");
const OtpController = require("../../controllers/User/otpController");



router.post("/sign-in", authController.login);
router.post("/sign-up", authController.register); 

router.post("/health-info", authUserApp, healthInfo.addHealthInfo); 


// Lấy review theo trainer
router.get("/trainer/:trainerId", ReviewController.getReviewsByTrainer);
// Tạo review mới
router.post("/create-review", ReviewController.createReview);
// Tạo update review
router.put("/update-review/:id", authUserApp, ReviewController.updateReview);
// Tạo delete review
router.delete("/delete-review/:id", authUserApp, ReviewController.deleteReview);
// Like / Unlike review
// router.post("/:reviewId/like", ReviewController.toggleLike);
// Change password
router.post('/send', authUserApp, OtpController.sendOtp);
router.post('/verify', authUserApp, OtpController.verifyOtp);



module.exports = router;