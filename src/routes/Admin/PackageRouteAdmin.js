const express = require("express");
const routes = express.Router();
const packageAdminController =
  require("../../controllers/Admin/PackageAdminController").createPackage;

routes.post("/create-package", packageAdminController.createPackage);

module.exports = routes;
