const express = require("express");
const router = express.Router();

const UserRouteAdmin = require("./Admin/UserRouteAdmin");
const PackageRouteAdmin = require("./Admin/PackageRouteAdmin");
const RouteCustomer = require("./Customer/UserRouteCustomer");
const MembershipRouteAdmin = require("./Admin/MembershipRouteAdmin");
const TransactionshipRouteAdmin = require("./Admin/TransactionRouteAdmin");
const WorkoutRouteAdmin = require("./Admin/WorkoutRouteAdmin");

// Admin
router.use("/user", UserRouteAdmin);
router.use("/admin", PackageRouteAdmin);
router.use("/admin", MembershipRouteAdmin);
router.use("/admin", TransactionshipRouteAdmin);
router.use("/admin", WorkoutRouteAdmin);

// Customer
router.use("/customer", RouteCustomer);

// Staff

module.exports = router;
