const express = require("express");
const routes = express.Router();
const UserAdminController = require("../../controllers/Admin/UserAdminController");
const {
  authMiddleware,
  authUserMiddleware,
} = require("../../middlewares/authMiddleware/authMiddleware");

routes.post("/sign-up", UserAdminController.createUser);
routes.post("/sign-in", UserAdminController.loginUser);
routes.put("/update-user/:id", authMiddleware, UserAdminController.updateUser);
routes.put("/delete-user/:id", authMiddleware, UserAdminController.deleteUser);
routes.get("/get-all-users", authMiddleware, UserAdminController.getAllUsers);
routes.get(
  "/get-details-user/:id",
  authUserMiddleware,
  UserAdminController.getDetailsUser
);
routes.post("/refresh-token", UserAdminController.refreshToken);

module.exports = routes;
