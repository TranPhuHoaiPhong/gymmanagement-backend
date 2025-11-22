const express = require("express");
const router = express.Router();

const UserRouteAdmin = require("./Admin/UserRouteAdmin");
const PackageRouteAdmin = require("./Admin/PackageRouteAdmin");
const RouteCustomer = require("./Customer/UserRouteCustomer");
const MembershipRouteAdmin = require("./Admin/MembershipRouteAdmin");
const TransactionshipRouteAdmin = require("./Admin/TransactionRouteAdmin");
const WorkoutRouteAdmin = require("./Admin/WorkoutRouteAdmin");
const TrainerSessionRouteAdmin = require("./Admin/TrainerSessionRouteAdmin");
const ReviewRouteAdmin = require("./Admin/ReviewRouteAdmin");
const CheckInLogRouteAdmin = require("./Admin/CheckInLogRouteAdmin");

// Admin
router.use("/user", UserRouteAdmin);
router.use("/admin", PackageRouteAdmin);
router.use("/admin", MembershipRouteAdmin);
router.use("/admin", TransactionshipRouteAdmin);
router.use("/admin", WorkoutRouteAdmin);
router.use("/admin", TrainerSessionRouteAdmin);
router.use("/admin", ReviewRouteAdmin);
router.use("/admin", CheckInLogRouteAdmin);

// Customer
router.use("/customer", RouteCustomer);

// Staff

module.exports = router;
