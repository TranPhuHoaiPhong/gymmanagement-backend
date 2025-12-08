const TransactionAdminService = require("../../services/Admin/TransactionAdminService");
const Transaction = require("../../models/Transaction/transaction");

const createTransaction = async (req, res) => {
  try {
    const { userId, packageId, membershipId, amount, paymentMethod, status } =
      req.body;

    // Validate cơ bản
    if (!userId || !packageId || !membershipId || !amount || !paymentMethod) {
      return res.status(400).json({
        status: "ERROR",
        message: "Thiếu thông tin cần thiết",
      });
    }

    const resTransaction = await TransactionAdminService.createTransaction({
      userId,
      packageId,
      membershipId,
      amount,
      paymentMethod,
      status,
    });

    return res.status(200).json(resTransaction);
  } catch (error) {
    console.error("Lỗi tạo Transaction:", error);
    return res.status(500).json({
      status: "ERROR",
      message: "Lỗi máy chủ, vui lòng thử lại sau",
    });
  }
};

const createTransactionDirect = async (req, res) => {
  try {
    const { userId, packageId, trainerId } = req.body;

    if (!userId || !packageId) {
      return res.status(400).json({
        status: "ERROR",
        message: "Thiếu thông tin cần thiết",
      });
    }

    const resTransaction =
      await TransactionAdminService.createTransactionDirect({
        userId,
        packageId,
        trainerId,
      });
    return res.status(200).json(resTransaction);
  } catch (error) {
    console.error("Lỗi tạo Transaction trực tiếp:", error);
    return res.status(500).json({
      status: "ERROR",
      message: "Lỗi máy chủ, vui lòng thử lại sau",
    });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const data = req.body;

    if (!transactionId) {
      return res.status(400).json({
        status: "ERROR",
        message: "transactionId khong hop le",
      });
    }

    const resTransaction = await TransactionAdminService.updateTransaction(
      transactionId,
      data
    );

    return res.status(200).json(resTransaction);
  } catch (error) {
    console.error("Lỗi sửa Transaction:", error);
    return res.status(500).json({
      status: "ERROR",
      message: "Lỗi máy chủ, vui lòng thử lại sau",
    });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const resTransaction = await TransactionAdminService.getAllTransactions();

    return res.status(200).json(resTransaction);
  } catch (error) {
    console.error("Lỗi lấy tất cả Transaction:", error);
    return res.status(500).json({
      status: "ERROR",
      message: "Lỗi máy chủ, vui lòng thử lại sau",
    });
  }
};

const getDetailsTransaction = async (req, res) => {
  try {
    const transactionId = req.params.id;
    if (!transactionId) {
      return res.status(400).json({
        status: "ERROR",
        message: "transactionId khong hop le",
      });
    }
    const resTransaction = await TransactionAdminService.getDetailsTransaction(
      transactionId
    );

    return res.status(200).json(resTransaction);
  } catch (error) {
    console.error("Lỗi lấy tất cả Transaction:", error);
    return res.status(500).json({
      status: "ERROR",
      message: "Lỗi máy chủ, vui lòng thử lại sau",
    });
  }
};

const getReportTransaction = async (req, res) => {
  try {
    const data = await TransactionAdminService.getReportTransaction(req.query);
    return res.status(200).json({ status: "OK", data });
  } catch (error) {
    console.error("Lỗi lấy report:", error);
    return res.status(500).json({ status: "ERROR", message: "Server error" });
  }
};

const exportExcel = async (req, res) => {
  try {
    const workbook = await TransactionAdminService.buildExcelWorkbook(
      req.query
    );

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=report.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Lỗi xuất Excel:", error);
    res.status(500).json({ status: "ERROR", message: "Lỗi server" });
  }
};

const exportPDF = async (req, res) => {
  try {
    const doc = await TransactionAdminService.buildPDFDocument(req.query);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=report.pdf");

    doc.pipe(res);
    doc.end();
  } catch (error) {
    console.error("Lỗi xuất PDF:", error);
    res.status(500).json({ status: "ERROR", message: "Lỗi server" });
  }
};

module.exports = {
  createTransaction,
  updateTransaction,
  getAllTransactions,
  getDetailsTransaction,
  getReportTransaction,
  exportExcel,
  exportPDF,
  createTransactionDirect,
};
