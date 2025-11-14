const express = require("express");
const routes = express.Router();
const TrainerSessionAdminController = require("../../controllers/Admin/TrainerSessionAdminController");

routes.post(
  "/create-trainersession",
  TrainerSessionAdminController.createTrainersession
);

routes.post(
  "/update-trainersession/:id",
  TrainerSessionAdminController.updateTrainersession
);

routes.get(
  "/get-all-trainersessions",
  TrainerSessionAdminController.getAllTrainersessions
);

routes.get(
  "/get-details-trainersession/:id",
  TrainerSessionAdminController.getDetailsTrainersession
);

module.exports = routes;
