const express = require("express");
const routes = express.Router();
const TransactionAdminController = require("../../controllers/Admin/TransactionAdminController");
const {
  authStaff,
  authUserMiddleware,
  authMiddleware,
} = require("../../middlewares/authMiddleware/authMiddleware");

routes.post(
  "/create-transaction",
  TransactionAdminController.createTransaction 
);

routes.post(
  "/update-transaction/:id",
  authMiddleware,
  TransactionAdminController.updateTransaction
);

routes.get(
  "/get-all-transactions",
  authMiddleware,
  TransactionAdminController.getAllTransactions
);

routes.get(
  "/get-details-transaction/:id",
  TransactionAdminController.getDetailsTransaction
);

routes.get(
  "/get-report-transaction",
  authMiddleware,
  TransactionAdminController.getReportTransaction
);

routes.get(
  "/get-report-transaction/excel",
  authMiddleware,
  TransactionAdminController.exportExcel
);

routes.get(
  "/get-report-transaction/pdf",
  authMiddleware,
  TransactionAdminController.exportPDF
);

module.exports = routes;
