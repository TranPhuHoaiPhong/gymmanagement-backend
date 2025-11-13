const User = require("../../models/User/User");
const Package = require("../../models/Package/package");
const Membership = require("../../models/Membership/membership");
const Transaction = require("../../models/Transaction/transaction");

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
        status: "pending",
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

      // Nếu có cập nhật trạng thái
      if (status) {
        // Ngăn sửa giao dịch đã hoàn tất
        if (checkTransaction.status === "completed") {
          return resolve({
            status: "ERROR",
            message: "Giao dịch đã hoàn tất, không thể chỉnh sửa.",
          });
        }

        checkTransaction.status = status;

        // Nếu giao dịch chuyển sang completed
        if (status === "completed" && checkTransaction.membershipId) {
          const membership = checkTransaction.membershipId;
          membership.status = "active";
          await membership.save();

          // Tăng số lượng đăng ký của gói
          const pkg = checkTransaction.packageId;
          pkg.registeredCount = (pkg.registeredCount || 0) + 1;
          await pkg.save();
        }
      }

      // Nếu có cập nhật phương thức thanh toán
      if (paymentMethod) {
        checkTransaction.paymentMethod = paymentMethod;
      }

      // Lưu lại các thay đổi
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
      const getAllTransactions = await Transaction.find();

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

module.exports = {
  createTransaction,
  updateTransaction,
  getAllTransactions,
  getDetailsTransaction,
};
