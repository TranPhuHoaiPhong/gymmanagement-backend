const express = require("express");
const routes = express.Router();
const UserAdminController = require("../../controllers/Admin/UserAdminController");

routes.post("/sign-up", UserAdminController.createUser);
routes.post("/sign-in", UserAdminController.loginUser);

module.exports = routes;
