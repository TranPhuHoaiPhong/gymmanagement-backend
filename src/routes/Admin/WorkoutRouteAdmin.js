const express = require("express");
const routes = express.Router();
const WorkoutAdminController = require("../../controllers/Admin/WorkoutAdminController");

routes.post("/create-workout", WorkoutAdminController.createWorkout);
routes.post("/update-workout/:id", WorkoutAdminController.updateWorkout);
routes.get("/get-workouts", WorkoutAdminController.getWorkouts);
routes.get(
  "/get-details-workout/:id",
  WorkoutAdminController.getDetailsWorkout
);
module.exports = routes;
