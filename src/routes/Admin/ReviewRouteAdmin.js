const express = require("express");
const routes = express.Router();
const ReviewAdminController = require("../../controllers/Admin/ReviewAdminController");

routes.post("/create-review", ReviewAdminController.createReiview);

// routes.post(
//   "/update-trainersession/:id",
//   TrainerSessionAdminController.updateTrainersession
// );

// routes.get(
//   "/get-all-trainersessions",
//   TrainerSessionAdminController.getAllTrainersessions
// );

// routes.get(
//   "/get-details-trainersession/:id",
//   TrainerSessionAdminController.getDetailsTrainersession
// );

module.exports = routes;
