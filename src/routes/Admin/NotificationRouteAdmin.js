const express = require("express");
const routes = express.Router();
const NotificationAdminController = require("../../controllers/Admin/NotificationAdminController");
const {
  authUserMiddleware,
  authMiddleware,
} = require("../../middlewares/authMiddleware/authMiddleware");

routes.post(
  "/send-notification",
  authMiddleware,
  NotificationAdminController.sendNotification
);

routes.get(
  "/get-all-notifications",
  authMiddleware,
  NotificationAdminController.getAllNotification
);

module.exports = routes;
