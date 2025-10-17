const express = require("express");
const router = express.Router();
const routeCustomer = require("./Customer/UserRouteCustomer");

router.use("/auth", routeCustomer);

module.exports = router;