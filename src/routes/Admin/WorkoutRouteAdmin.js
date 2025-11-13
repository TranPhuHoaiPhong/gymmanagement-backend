const express = require("express");
const routes = express.Router();
const WorkoutAdminController = require("../../controllers/Admin/WorkoutAdminController");

routes.post("/create-workout", WorkoutAdminController.createWorkout);
module.exports = routes;
