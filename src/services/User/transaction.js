const Transaction = require("../../models/Transaction/transaction");
const User = require("../../models/User/User");
const Package = require("../../models/Package/package");
const Membership = require("../../models/Membership/Membership");
const Notification = require("../../models/Notification/Notification");

class TransactionService {

  static async createTransaction(newTransaction) {
     
    try { 
    const { userId, packageId, membershipId, paymentMethod } = newTransaction;
    const pkg = await Package.findById(packageId);

    if (!pkg) {
      return res.status(404).json({ success: false, message: "Package not found" });
    }

    const amount = pkg.price;

      const checkUser = await User.findById(userId);
      if (!checkUser) {
        return {
            success: false,
            message: "Người dùng không tồn tại",
        };
      }
      const checkPackage = await Package.findById(packageId);
      if (!checkPackage) {
        return {
            success: false,
            message: "Gối tập không tồn tại",
        };
      }
      if (checkPackage.isActive === false) {
        return {
            success: false,
            message: "Gối tập đã bị khóa",
        };
      }

      const checkMembership = await Membership.findById(membershipId);
      if (!checkMembership) {
        return {
            success: false,
            message: "Member không tồn tại",
        };
      }
      if (checkMembership.userId.toString() !== userId) {
        return {
            success: false,
            message: "Member không thuộc về người dùng này",
        };
      }


      
      const createdTransaction = await Transaction.create({
        userId,
        packageId,
        membershipId: membershipId || null,
        amount,
        paymentMethod,
        status: "completed",
      });
    


    await Notification.create({ 
          userId: userId,
          type: "purchase", // Hoặc "deal" tùy logic
          title: "Thanh toán mua hàng",
          message: `Bạn vừa thanh toán mua hàng thành công gói hàng trị giá ${formatAmount(amount)}đ`,
          target: "single",
          isRead: false,
          data: {} 
        });

      return {
        success: true,
        message: "Tạo giao dịch thành công.",
        data: createdTransaction,
    };

    } catch (e) {
       return {
        success: false,
        message: "Lỗi.",
    };
    }
}
}

module.exports = TransactionService;
