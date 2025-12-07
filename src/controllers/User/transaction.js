const TransactionService = require("../../services/User/transaction");

class TransactionController {
  static async createTransaction(req, res) {
    const userId = req.userId;
    const { packageId, membershipId, paymentMethod } =
      req.body;

    const newTransaction = {
      userId,
      packageId,
    membershipId,
    paymentMethod,
    };

  
    try {
      const transaction = await TransactionService.createTransaction(newTransaction)
      if (!transaction.success) {
        return res.status(400).json({ msg: transaction.message });
      }
      res.status(200).json(transaction);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = TransactionController;
