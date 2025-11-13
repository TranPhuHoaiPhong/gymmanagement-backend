const express = require("express");
const routes = express.Router();
const TransactionAdminController = require("../../controllers/Admin/TransactionAdminController");

routes.post(
  "/create-transaction",
  TransactionAdminController.createTransaction
);

module.exports = routes;
