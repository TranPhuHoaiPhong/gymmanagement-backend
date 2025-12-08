const express = require("express");
const routes = express.Router();
const ReviewAdminController = require("../../controllers/Admin/ReviewAdminController");

routes.post("/create-review", ReviewAdminController.createReview);

routes.get(
  "/get-trainer-reviews/:trainerId",
  ReviewAdminController.getTrainerReviews
);

routes.delete("/delete-review/:reviewId", ReviewAdminController.deleteReview);

module.exports = routes;
