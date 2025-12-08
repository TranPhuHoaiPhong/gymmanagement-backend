const express = require("express");
const router = express.Router();
const authController = require("../../controllers/User/authController");
const healthInfo = require("../../controllers/User/healthInfo");
const { authUserApp } = require("../../middlewares/authMiddleware/authMiddleware");
const ReviewController = require("../../controllers/User/reviewController");
const OtpController = require("../../controllers/User/otpController");
const MessageController = require("../../controllers/User/message");
const TransactionAdminController = require("../../controllers/Admin/TransactionAdminController");
const TransactionController = require("../../controllers/User/transaction");
const MemberCheckController = require("../../controllers/User/Member");
const upload = require("../../middlewares/upload");
const UserController = require("../../controllers/User/user");



router.post("/sign-in", authController.login);
router.post("/sign-up", authController.register); 

// add health info
router.post("/health-info", authUserApp, healthInfo.addHealthInfo);  


router.put("/update-health-info", authUserApp, healthInfo.updateHealthInfo);  



// get health info 
router.get("/get-health-info", authUserApp, healthInfo.getHealthInfo); 

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

router.get('/message/:id', MessageController.getMessage);

router.get('/message-all', MessageController.getAllMessage);

// Transaction routes
router.post(
  "/create-transaction-member",
  authUserApp,
  TransactionController.createTransaction
);

// check member 
router.get(
  "/member-check",
  authUserApp,
  MemberCheckController.memberavalable
);

router.put(
  "/upload-avatar",
  upload.single("avatar"),
  authUserApp,
  UserController.updateUser
);

router.get(
  "/detail_user",
  authUserApp,
  UserController.detailUser
);




module.exports = router;