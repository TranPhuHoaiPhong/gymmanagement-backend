const express = require("express");
const routes = express.Router();
const CheckInQRAdminController = require("../../controllers/Admin/CheckInQRAdminController");
const {
  authUserMiddleware,
  authMiddleware,
  authAdminOrStaff,
  authUserOrAdminOrStaff,
  authUserApp,
} = require("../../middlewares/authMiddleware/authMiddleware");

routes.post(
  "/checkin/qr/create",
  authAdminOrStaff,
  CheckInQRAdminController.checkInQRcreate
); // (admin or staff tạo)

routes.post(
  "/checkin/qr/verify",
  authUserApp,
  CheckInQRAdminController.verifyQR
); //  (member quét)

routes.get(
  "/checkin/members",
  authAdminOrStaff,
  CheckInQRAdminController.getMembers
);

routes.get(
  "/checkin/history-all",
  authAdminOrStaff,
  CheckInQRAdminController.getAllCheckInHistory
);

module.exports = routes;
