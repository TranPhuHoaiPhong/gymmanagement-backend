const CheckInQRAdminService = require("../../services/Admin/CheckInQRAdminService");

const checkInQRcreate = async (req, res) => {
  try {
    const { membershipId, memberId } = req.body;

    if (!membershipId || !memberId) {
      return res.status(400).json({
        status: "ERROR",
        message: "Thiếu membershipId hoặc memberId",
      });
    }

    const qr = await CheckInQRAdminService.checkInQRcreate({
      membershipId,
      memberId,
    });

    return res.status(201).json({
      status: "OK",
      message: "Tạo QR thành công",
      data: qr,
    });
  } catch (error) {
    return res.status(500).json({
      status: "ERROR",
      message: error.message,
    });
  }
};

const verifyQR = async (req, res) => {
  try {
    const { hash } = req.body;
    const userId = req.userId; // member đang quét QR

    if (!hash) {
      return res.status(400).json({ status: "ERROR", message: "Thiếu hash" });
    }

    const result = await CheckInQRAdminService.verifyQR(hash, userId);

    return res.status(200).json({
      status: "OK",
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    return res.status(400).json({ status: "ERROR", message: error.message });
  }
};

const getMembers = async (req, res) => {
  try {
    const getAllMembers = await CheckInQRAdminService.getMembers();
    return res.status(200).json(getAllMembers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "ERROR",
      message: "Server error",
    });
  }
};

const getAllCheckInHistory = async (req, res) => {
  try {
    const result = await CheckInQRAdminService.getAllCheckInHistory();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: "ERROR",
      message: error.message,
    });
  }
};

module.exports = {
  checkInQRcreate,
  getMembers,
  verifyQR,
  getAllCheckInHistory,
};
