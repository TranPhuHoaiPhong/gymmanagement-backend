const express = require("express");
const routes = express.Router();
const UserAdminController = require("../../controllers/Admin/UserAdminController");

routes.post("/", UserAdminController.createUser);

module.exports = routes;
