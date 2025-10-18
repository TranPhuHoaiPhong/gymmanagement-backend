const express = require("express");
const router = express.Router();

const UserRouteAdmin = require("./Admin/UserRouteAdmin");
const RouteCustomer = require("./Customer/UserRouteCustomer");

// Admin
router.use("/user", UserRouteAdmin);

// Customer
router.use("/customer", RouteCustomer);

// Staff

module.exports = router;
