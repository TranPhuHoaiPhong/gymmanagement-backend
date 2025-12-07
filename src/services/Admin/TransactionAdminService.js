const User = require("../../models/User/User");
const Package = require("../../models/Package/package");
const Membership = require("../../models/Membership/membership");
const Transaction = require("../../models/Transaction/transaction");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");
const path = require("path");

const createTransaction = (newTransaction) => {
  return new Promise(async (resolve, reject) => {
    try { 
      const { userId, packageId, membershipId, amount, paymentMethod, status } =
        newTransaction;

      const checkUser = await User.findById(userId);
      if (!checkUser) {
        return resolve({
          status: "ERROR",
          message: "Người dùng không tồn tại.",
        });
      }
      const checkPackage = await Package.findById(packageId);
      if (!checkPackage) {
        return resolve({
          status: "ERROR",
          message: "Gói tập không tồn tại.",
        });
      }
      if (checkPackage.isActive === false) {
        return resolve({
          status: "ERROR",
          message: "Gói tập đã bị khóa.",
        });
      }

      const checkMembership = await Membership.findById(membershipId);
      if (!checkMembership) {
        return resolve({
          status: "ERROR",
          message: "Membership không tồn tại.",
        });
      }
      if (checkMembership.userId.toString() !== userId) {
        return resolve({
          status: "ERROR",
          message: "Membership không thuộc về người dùng này.",
        });
      }

      if (amount !== checkPackage.price) {
        return resolve({
          status: "ERROR",
          message: "Số tiền thanh toán không khớp với giá gói.",
        });
      }

      const existingTxn = await Transaction.findOne({
        userId,
        packageId,
        status: "completed",
      });
      if (existingTxn)
        return resolve({
          status: "ERROR",
          message: "Bạn đã có giao dịch đang chờ xử lý cho gói này.",
        });

      const createdTransaction = await Transaction.create({
        userId,
        packageId,
        membershipId: membershipId || null,
        amount,
        paymentMethod,
        status: "pending",
      });

      resolve({
        status: "OK",
        message: "Tạo giao dịch thành công.",
        data: createdTransaction,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateTransaction = (transactionId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkTransaction = await Transaction.findById(
        transactionId
      ).populate("membershipId packageId");

      if (!checkTransaction) {
        return resolve({
          status: "ERROR",
          message: "Giao dịch không tồn tại.",
        });
      }

      const { status, paymentMethod } = data;

      if (status) {
        if (checkTransaction.status === "completed") {
          return resolve({
            status: "ERROR",
            message: "Giao dịch đã hoàn tất, không thể chỉnh sửa.",
          });
        }

        checkTransaction.status = status;

        if (status === "completed" && checkTransaction.membershipId) {
          const membership = checkTransaction.membershipId;
          membership.status = "active";
          await membership.save();

          const pkg = checkTransaction.packageId;
          pkg.registeredCount = (pkg.registeredCount || 0) + 1;
          await pkg.save();
        }
      }

      if (paymentMethod) {
        checkTransaction.paymentMethod = paymentMethod;
      }

      const updatedTransaction = await checkTransaction.save();

      resolve({
        status: "OK",
        message: "Cập nhật giao dịch thành công.",
        data: updatedTransaction,
      });
    } catch (e) {
      console.error("Lỗi updateTransaction:", e);
      reject(e);
    }
  });
};

const getAllTransactions = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const getAllTransactions = await Transaction.find()
        .populate("userId", "fullName email phone")
        .populate("packageId", "name price description")
        .populate("membershipId", "status startDate endDate");

      resolve({
        status: "OK",
        message: "Lấy tất cả giao dịch thành công.",
        data: getAllTransactions,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailsTransaction = (transactionId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkTransaction = await Transaction.findOne({
        _id: transactionId,
      });

      if (!checkTransaction) {
        return resolve({
          status: "ERROR",
          message: "Giao dịch không tồn tại.",
        });
      } else {
        resolve({
          status: "OK",
          message: "Lấy chi tiết giao dịch thành công.",
          data: checkTransaction,
        });
      }
    } catch (e) {
      console.error("Lỗi updateTransaction:", e);
      reject(e);
    }
  });
};

const getReportTransaction = async ({ from, to, paymentMethod, status }) => {
  let query = {};

  // Filter by date
  if (from && to) {
    query.createdAt = {
      $gte: new Date(from),
      $lte: new Date(to),
    };
  }

  // Filter payment
  if (paymentMethod && paymentMethod !== "all") {
    query.paymentMethod = paymentMethod;
  }

  // Filter status
  if (status && status !== "all") {
    query.status = status;
  }

  const transactions = await Transaction.find(query)
    .populate("userId", "fullName")
    .populate("packageId", "name price")
    .sort({ createdAt: -1 });

  return transactions.map((t) => ({
    date: t.createdAt.toLocaleString("vi-VN"),
    customer: t.userId?.fullName || "Không có",
    package: t.packageId?.name || "Không có",
    amount: t.amount,
    paymentMethod: t.paymentMethod,
    status: t.status,
  }));
};

const buildExcelWorkbook = async ({ from, to, paymentMethod, status }) => {
  let filter = {};

  // Lọc theo ngày (ĐÚNG FIELD)
  if (from && to) {
    filter.createdAt = {
      $gte: new Date(from),
      $lte: new Date(to),
    };
  }

  // Lọc phương thức thanh toán
  if (paymentMethod && paymentMethod !== "all") {
    filter.paymentMethod = paymentMethod;
  }

  // Lọc trạng thái
  if (status && status !== "all") {
    filter.status = status;
  }

  const transactions = await Transaction.find(filter)
    .populate("userId", "fullName")
    .populate("packageId", "name")
    .sort({ createdAt: -1 });

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Transactions");

  worksheet.columns = [
    { header: "Ngày", key: "date", width: 20 },
    { header: "Khách hàng", key: "user", width: 25 },
    { header: "Gói tập", key: "package", width: 25 },
    { header: "Số tiền", key: "amount", width: 15 },
    { header: "Phương thức", key: "method", width: 20 },
    { header: "Trạng thái", key: "status", width: 15 },
  ];

  transactions.forEach((t) => {
    worksheet.addRow({
      date: t.createdAt.toLocaleString("vi-VN"),
      user: t.userId?.fullName || "Không có",
      package: t.packageId?.name || "Không có",
      amount: t.amount,
      method: t.paymentMethod,
      status: t.status,
    });
  });

  return workbook;
};

const buildPDFDocument = async ({ from, to, paymentMethod, status }) => {
  let filter = {};

  // Lọc đúng theo createdAt
  if (from && to) {
    filter.createdAt = {
      $gte: new Date(from),
      $lte: new Date(to),
    };
  }

  if (paymentMethod && paymentMethod !== "all") {
    filter.paymentMethod = paymentMethod;
  }

  if (status && status !== "all") {
    filter.status = status;
  }

  const transactions = await Transaction.find(filter)
    .populate("userId", "fullName")
    .populate("packageId", "name")
    .sort({ createdAt: -1 });

  // Load custom font
  const fontPath = path.join(
    __dirname,
    "../../assets/fonts/Roboto-Regular.ttf"
  );

  const doc = new PDFDocument({ margin: 40 });
  doc.font(fontPath);

  // Title
  doc.fontSize(20).text("BÁO CÁO GIAO DỊCH", { align: "center" });
  doc.moveDown();

  // Nội dung
  transactions.forEach((t) => {
    doc.fontSize(12).text(
      `Ngày: ${t.createdAt.toLocaleString("vi-VN")}
Khách hàng: ${t.userId?.fullName || "Không có"}
Gói tập: ${t.packageId?.name || "Không có"}
Số tiền: ${t.amount.toLocaleString("vi-VN")} ₫
Phương thức: ${t.paymentMethod}
Trạng thái: ${t.status}
--------------------------------------------`
    );

    doc.moveDown(0.5);
  });

  return doc;
};

module.exports = {
  createTransaction,
  updateTransaction,
  getAllTransactions,
  getDetailsTransaction,
  getReportTransaction,
  buildExcelWorkbook,
  buildPDFDocument,
};
