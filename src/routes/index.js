const express = require("express");
const router = express.Router();

const UserRouteAdmin = require("./Admin/UserRouteAdmin");
const PackageRouteAdmin = require("./Admin/PackageRouteAdmin");
const RouteCustomer = require("./Customer/UserRouteCustomer");
const MembershipRouteAdmin = require("./Admin/MembershipRouteAdmin");

// Admin
router.use("/user", UserRouteAdmin);
router.use("/admin", PackageRouteAdmin);
router.use("/admin", MembershipRouteAdmin);

// Customer
router.use("/customer", RouteCustomer);

// Staff

module.exports = router;
