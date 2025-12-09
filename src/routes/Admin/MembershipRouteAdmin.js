const express = require("express");
const routes = express.Router();
const MembershipAdminController = require("../../controllers/Admin/MembershipAdminController");
const {
  authUserMiddleware,
  authMiddleware,
  authAdminOrStaff,
} = require("../../middlewares/authMiddleware/authMiddleware");

routes.post("/create-membership", MembershipAdminController.createMembership);
// Thanh toán Online Membership
routes.post("/payment-membership", MembershipAdminController.paymentMembership);
routes.post(
  "/update-membership/:id",
  MembershipAdminController.updateMembership
);
routes.delete(
  "/delete-membership/:id",
  MembershipAdminController.deleteMembership
);
routes.get(
  "/get-all-memberships",
  authAdminOrStaff,
  MembershipAdminController.getAllMembership
);
routes.get(
  "/get-details-membership/:id",
  MembershipAdminController.getDetailsMembership
);
routes.get(
  "/get-details-current-membership/:id",
  MembershipAdminController.getCurrentMembership 
);

routes.post(
  "/renew-membership/:id",
  authMiddleware,
  MembershipAdminController.renewMembership
);

module.exports = routes;
