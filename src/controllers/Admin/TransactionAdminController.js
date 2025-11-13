const TransactionAdminService = require("../../services/Admin/TransactionAdminService");

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

module.exports = {
  createTransaction,
  updateTransaction,
  getAllTransactions,
  getDetailsTransaction,
};
