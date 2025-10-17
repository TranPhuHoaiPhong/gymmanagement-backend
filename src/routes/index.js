const express = require("express");
const router = express.Router();

const UserRouteAdmin = require("./Admin/UserRouteAdmin");
const RouteCustomer = require("./Customer/UserRouteCustomer");


router.use("/user", UserRouteAdmin);
router.use("/auth", RouteCustomer);

module.exports = router;
