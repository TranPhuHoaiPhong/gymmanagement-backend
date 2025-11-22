const express = require("express");
const routes = express.Router();
const packageAdminController = require("../../controllers/Admin/PackageAdminController");
const {
  authUserMiddleware,
  authMiddleware,
} = require("../../middlewares/authMiddleware/authMiddleware");

routes.post(
  "/create-package",
  authMiddleware,
  packageAdminController.createPackage
);
routes.post(
  "/update-package/:id",
  authMiddleware,
  packageAdminController.updatePackage
);
routes.delete(
  "/delete-package/:id",
  authMiddleware,
  packageAdminController.deletePackage
);
routes.get("/get-all-packages", packageAdminController.getAllPackages);
routes.get(
  "/get-details-package/:id",
  packageAdminController.getDetailsPackage
);

routes.get(
  "/search-package",
  authMiddleware,
  packageAdminController.searchPackages
);

module.exports = routes;
