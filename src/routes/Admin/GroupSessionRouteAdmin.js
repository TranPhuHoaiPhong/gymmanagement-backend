const express = require("express");
const routes = express.Router();
const GroupSessionAdminController = require("../../controllers/Admin/GroupSessionAdminController");

routes.post(
  "/create-groupsession",
  GroupSessionAdminController.createGroupsession
);

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
