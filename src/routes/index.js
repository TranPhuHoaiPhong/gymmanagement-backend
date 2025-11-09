const express = require("express");
const router = express.Router();

const UserRouteAdmin = require("./Admin/UserRouteAdmin");
const PackageRouteAdmin = require("./Admin/PackageRouteAdmin");
const RouteCustomer = require("./Customer/UserRouteCustomer");

// Admin
router.use("/user", UserRouteAdmin);
router.use("/admin", PackageRouteAdmin);

// Customer
router.use("/customer", RouteCustomer);

// Staff

module.exports = router;
