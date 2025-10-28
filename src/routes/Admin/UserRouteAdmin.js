const express = require("express");
const routes = express.Router();
const UserAdminController = require("../../controllers/Admin/UserAdminController");
const {
  authenticate,
  authorizeRoles,
  authUserMiddleware,
} = require("../../middlewares/authMiddleware/authMiddleware");

/**
 * Public routes (không cần token)
 */
routes.post("/sign-up", UserAdminController.createUser);
routes.post("/sign-in", UserAdminController.loginUser);
routes.post("/refresh-token", UserAdminController.refreshToken);

/**
 * Protected routes (cần token)
 */

// Lấy danh sách tất cả user (chỉ Admin hoặc Staff)
routes.get(
  "/get-all-users",
  // authenticate, nhớ bật khi test
  // authorizeRoles("admin", "staff"),
  UserAdminController.getAllUsers
);

// Cập nhật thông tin user (Admin hoặc Staff)
routes.put(
  "/update-user/:id",
  authenticate,
  authorizeRoles("admin", "staff"),
  UserAdminController.updateUser
);

// Xóa user (chỉ Admin)
routes.put(
  "/delete-user/:id",
  authenticate,
  authorizeRoles("admin"),
  UserAdminController.deleteUser
);

//  Lấy chi tiết user (Admin hoặc chính user đó)
routes.get(
  "/get-details-user/:id",
  authUserMiddleware,
  UserAdminController.getDetailsUser
);

module.exports = routes;
