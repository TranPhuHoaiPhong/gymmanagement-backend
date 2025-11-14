const TrainerSessionAdminService = require("../../services/Admin/TrainerSessionAdminService");

const createTrainersession = async (req, res) => {
  try {
    const { membershipId, trainerId, userId, sessionDate } = req.body;

    if (!membershipId || !trainerId || !userId || !sessionDate) {
      return res.status(400).json({
        status: "ERROR",
        message: "Thiếu thông tin cần thiết",
      });
    }

    const resCreate = await TrainerSessionAdminService.createTrainersession({
      membershipId,
      trainerId,
      userId,
      sessionDate,
    });

    return res.status(200).json(resCreate);
  } catch (error) {
    console.error("Lỗi tạo Trainersession:", error);
    return res.status(500).json({
      status: "ERROR",
      message: "Lỗi máy chủ, vui lòng thử lại sau",
    });
  }
};

module.exports = {
  createTrainersession,
};
