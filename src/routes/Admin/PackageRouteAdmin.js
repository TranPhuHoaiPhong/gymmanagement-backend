const express = require("express");
const routes = express.Router();
const packageAdminController = require("../../controllers/Admin/PackageAdminController");
const {
  authUserMiddleware,
  authMiddleware,
  authAdminOrStaff,
} = require("../../middlewares/authMiddleware/authMiddleware");

routes.post(
  "/create-package",
  authAdminOrStaff,
  packageAdminController.createPackage
);
routes.post(
  "/update-package/:id",
  authAdminOrStaff,
  packageAdminController.updatePackage
);
routes.delete(
  "/delete-package/:id",
  authAdminOrStaff,
  packageAdminController.deletePackage
);

routes.get("/get-all-packages", packageAdminController.getAllPackages);

routes.get(
  "/get-all-packages-active",
  packageAdminController.getAllPackagesActive
);

routes.get(
  "/get-details-package/:id",
  authMiddleware,
  packageAdminController.getDetailsPackage
);

routes.get(
  "/search-package",
  authMiddleware,
  packageAdminController.searchPackages
);

module.exports = routes;
