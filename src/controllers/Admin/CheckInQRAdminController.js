const CheckInQRAdminService = require("../../services/Admin/CheckInQRAdminService");

const checkInQRcreate = async (req, res) => {
  try {
    const { membershipId, memberId } = req.body;

    if (!membershipId || !memberId) {
      return res.status(400).json({
        status: "ERROR",
        message: "Thiếu thông tin cần thiết",
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
    console.error(error);
    return res.status(500).json({
      status: "ERROR",
      message: "Server error",
    });
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

module.exports = {
  checkInQRcreate,
  getMembers,
};
