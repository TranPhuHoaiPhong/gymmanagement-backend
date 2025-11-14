const express = require("express");
const routes = express.Router();
const packageAdminController = require("../../controllers/Admin/PackageAdminController");
const { authUserMiddleware } = require("../../middlewares/authMiddleware/authMiddleware");

routes.post("/create-package", packageAdminController.createPackage);
routes.post("/update-package/:id", packageAdminController.updatePackage);
routes.delete("/delete-package/:id", packageAdminController.deletePackage);
routes.get("/get-all-packages", packageAdminController.getAllPackages);
routes.get(
  "/get-details-package/:id",
  packageAdminController.getDetailsPackage
);

module.exports = routes;
