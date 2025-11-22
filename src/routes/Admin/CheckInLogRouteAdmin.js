const express = require("express");
const routes = express.Router();
const CheckInLogAdminController = require("../../controllers/Admin/CheckInLogAdminController");

routes.get("/get-all-checkinlogs", CheckInLogAdminController.getAllCheckInLogs);

module.exports = routes;
