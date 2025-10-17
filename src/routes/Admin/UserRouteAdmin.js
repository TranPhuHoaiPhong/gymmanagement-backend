const express = require("express");
const routes = express.Router();
const UserAdminController = require("../../controllers/Admin/UserAdminController");

routes.post("/sign-up", UserAdminController.createUser);
routes.post("/sign-in", UserAdminController.loginUser);
routes.put("/update-user/:id", UserAdminController.updateUser);
routes.put("/delete-user/:id", UserAdminController.deleteUser);

module.exports = routes;
