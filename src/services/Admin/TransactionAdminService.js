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

module.exports = {
  createTransaction,
};
