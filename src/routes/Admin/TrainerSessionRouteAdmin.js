const express = require("express");
const routes = express.Router();
const TrainerSessionAdminController = require("../../controllers/Admin/TrainerSessionAdminController");

routes.post(
  "/create-trainersession",
  TrainerSessionAdminController.createTrainersession
);

module.exports = routes;
