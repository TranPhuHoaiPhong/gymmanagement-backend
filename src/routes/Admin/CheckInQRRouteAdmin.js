const express = require("express");
const routes = express.Router();
const CheckInQRAdminController = require("../../controllers/Admin/CheckInQRAdminController");
const {
  authenticate,
  authorizeRoles,
  authUserMiddleware,
  authMiddleware,
} = require("../../middlewares/authMiddleware/authMiddleware");

routes.get(
  "/checkin/members",
  authMiddleware,
  CheckInQRAdminController.getMembers
);
routes.post(
  "/checkin/qr/create",
  authMiddleware,
  CheckInQRAdminController.checkInQRcreate
);

module.exports = routes;
