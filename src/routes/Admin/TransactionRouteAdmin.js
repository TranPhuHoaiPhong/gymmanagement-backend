const express = require("express");
const routes = express.Router();
const TransactionAdminController = require("../../controllers/Admin/TransactionAdminController");
const {
  authUserMiddleware,
  authMiddleware,
  authAdminOrStaff,
} = require("../../middlewares/authMiddleware/authMiddleware");

routes.post(
  "/create-transaction",
  TransactionAdminController.createTransaction
);

routes.post(
  "/create-transaction-direct",
  authAdminOrStaff,
  TransactionAdminController.createTransactionDirect
);

routes.post(
  "/send-transaction-otp",
  authAdminOrStaff,
  TransactionAdminController.sendTransactionOTP
);

routes.post(
  "/verify-transaction-otp",
  TransactionAdminController.verifyTransactionOTP
);

routes.post(
  "/update-transaction/:id",
  authAdminOrStaff,
  TransactionAdminController.updateTransaction
);

routes.get(
  "/get-all-transactions",
  authAdminOrStaff,
  TransactionAdminController.getAllTransactions
);

routes.get(
  "/get-all-amount-and-date-transactions",
  authAdminOrStaff,
  TransactionAdminController.getAllAmountAndDateTransactions
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
  authAdminOrStaff,
  TransactionAdminController.exportExcel
);

routes.get(
  "/get-report-transaction/pdf",
  authAdminOrStaff,
  TransactionAdminController.exportPDF
);

module.exports = routes;
