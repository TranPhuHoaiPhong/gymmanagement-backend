const express = require("express");
const routes = express.Router();
const UserAdminController = require("../../controllers/Admin/UserAdminController");
const {
  authStaff,
  authUserMiddleware,
  authMiddleware,
  authUserOrAdminOrStaff,
} = require("../../middlewares/authMiddleware/authMiddleware");
const upload = require("../../middlewares/upload");

/**
 * Public routes (không cần token)
 */
routes.post("/sign-up", UserAdminController.createUser);
routes.post("/sign-in", UserAdminController.loginUser);
routes.post("/log-out", UserAdminController.logoutUser);
routes.post("/refresh-token", UserAdminController.refreshToken);

/**
 * Protected routes (cần token)
 */

// Lấy danh sách tất cả user (chỉ Admin hoặc Staff)
routes.get("/get-all-users", authMiddleware, UserAdminController.getAllUsers);

routes.post("/create-member", authMiddleware, UserAdminController.createUser);

routes.get(
  "/get-all-members",
  authMiddleware,
  UserAdminController.getAllMembers
);

// Lấy danh sách tất cả trainer  getAllTrainers
routes.get(
  "/get-all-trainers",
  // authMiddleware,
  UserAdminController.getAllTrainers
);

routes.post("/create-trainer", authMiddleware, UserAdminController.createUser);

// Lấy danh sách tất cả staff
routes.get("/get-all-staffs", authMiddleware, UserAdminController.getAllStaffs);

// Cập nhật thông tin user (Admin hoặc Staff)
routes.post("/update-user/:id", authMiddleware, UserAdminController.updateUser);

// Xóa user (chỉ Admin)
routes.put("/delete-user/:id", authMiddleware, UserAdminController.deleteUser);

routes.get(
  "/get-details-trainer/:id",
  authMiddleware,
  UserAdminController.getDetailsTrainer
);

routes.get(
  "/get-details-member/:id",
  authMiddleware,
  UserAdminController.getDetailsMember
);

routes.get(
  "/get-details-user/:id",
  authUserOrAdminOrStaff,
  UserAdminController.getDetailsUser
);

routes.post(
  "/upload-avatar/:id",
  upload.single("avatar"),
  authMiddleware,
  UserAdminController.uploadAvatar
);

routes.post(
  "/reset-password",
  authMiddleware,
  UserAdminController.resetPasswordUser
);

module.exports = routes;
 