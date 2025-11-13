const express = require("express");
const routes = express.Router();
const TransactionAdminController = require("../../controllers/Admin/TransactionAdminController");

routes.post(
  "/create-transaction",
  TransactionAdminController.createTransaction
);

routes.post(
  "/update-transaction/:id",
  TransactionAdminController.updateTransaction
);

routes.get(
  "/get-all-transactions",
  TransactionAdminController.getAllTransactions
);

routes.get(
  "/get-details-transaction/:id",
  TransactionAdminController.getDetailsTransaction
);

module.exports = routes;
