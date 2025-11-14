const express = require("express");
const routes = express.Router();
const MembershipAdminController = require("../../controllers/Admin/MembershipAdminController");

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
routes.get("/get-all-memberships", MembershipAdminController.getAllMembership);
routes.get(
  "/get-details-membership/:id",
  MembershipAdminController.getDetailsMembership
);

module.exports = routes;
