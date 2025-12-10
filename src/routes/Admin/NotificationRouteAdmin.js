const express = require("express");
const routes = express.Router();
const NotificationAdminController = require("../../controllers/Admin/NotificationAdminController");
const {
  authAdminOrStaff,
  authAdminOrStaffOrTrainer,
} = require("../../middlewares/authMiddleware/authMiddleware");

routes.post(
  "/create-notification",
  authAdminOrStaff,
  NotificationAdminController.createNotification
);

routes.get(
  "/get-all-notifications",
  authAdminOrStaffOrTrainer,
  NotificationAdminController.getAllNotification
);

module.exports = routes;
