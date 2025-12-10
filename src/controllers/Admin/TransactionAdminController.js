const TransactionAdminService = require("../../services/Admin/TransactionAdminService");
const Transaction = require("../../models/Transaction/transaction");
const TransactionOTP = require("../../models/TransactionOTP/TransactionOTP");
const User = require("../../models/User/User");
const Package = require("../../models/Package/package");
const sendEmail = require("../../services/utils/sendEmail");

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

const sendTransactionOTP = async (req, res) => {
  try {
    const { userId, packageId, trainerId } = req.body;

    console.log("req.body", req.body);

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ status: "ERROR", message: "User không tồn tại" });
    }

    const getEmail = user.email;
    if (!getEmail) {
      return res.status(400).json({
        status: "ERROR",
        message: "Email không hợp lệ",
      });
    }

    //

    const pack = await Package.findById(packageId);
    if (!pack) {
      return res
        .status(400)
        .json({ status: "ERROR", message: "Gói tập không tồn tại" });
    }

    // Tạo OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Lưu vào bảng TransactionOTP
    await TransactionOTP.create({
      memberId: userId,
      otp,
      transactionData: { userId, packageId, trainerId },
      expireAt: new Date(Date.now() + 5 * 60 * 1000), // 5 phút
    });

    // Gửi email
    await sendEmail({
      to: getEmail,
      subject: "Xác nhận giao dịch tại GYM2P",
      html: `<p>Mã OTP của bạn là: <b>${otp}</b></p>`,
    });

    return res.status(200).json({
      status: "OK",
      message: "OTP đã gửi đến email member",
    });
  } catch (err) {
    console.error("Lỗi gửi OTP:", err);
    return res.status(500).json({
      status: "ERROR",
      message: "Lỗi máy chủ khi gửi OTP",
    });
  }
};

const verifyTransactionOTP = async (req, res) => {
  try {
    const { memberId, otp } = req.body;

    const existing = await TransactionOTP.findOne({ memberId }).sort({
      createdAt: -1,
    });

    if (!existing) {
      return res
        .status(400)
        .json({ status: "ERROR", message: "Không tìm thấy OTP" });
    }

    if (existing.otp !== otp) {
      return res
        .status(400)
        .json({ status: "ERROR", message: "OTP không đúng" });
    }

    // OTP đúng → tạo giao dịch trực tiếp
    const createRes = await TransactionAdminService.createTransactionDirect(
      existing.transactionData
    );

    // Xóa OTP
    await TransactionOTP.deleteOne({ _id: existing._id });

    return res.status(200).json(createRes);
  } catch (error) {
    console.error("Lỗi xác nhận OTP:", error);
    return res.status(500).json({
      status: "ERROR",
      message: "Lỗi máy chủ khi xác nhận OTP",
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

const getAllAmountAndDateTransactions = async (req, res) => {
  try {
    const resTransaction =
      await TransactionAdminService.getAllAmountAndDateTransactions();

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
  getAllAmountAndDateTransactions,
  sendTransactionOTP,
  verifyTransactionOTP,
};
