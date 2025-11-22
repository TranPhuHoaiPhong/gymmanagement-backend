const CheckInLogAdminService = require("../../services/Admin/CheckInLogAdminService");

const getAllCheckInLogs = async (req, res) => {
  try {
    const resCheckInLogs = await CheckInLogAdminService.getAllCheckInLogs();
    return res.status(200).json(resCheckInLogs);
  } catch (error) {
    console.error("Lỗi lấy tất cả CheckInLogs:", error);
    return res.status(500).json({
      status: "ERROR",
      message: "Lỗi máy chủ, vui lòng thử lại sau",
    });
  }
};

module.exports = {
  getAllCheckInLogs,
};
