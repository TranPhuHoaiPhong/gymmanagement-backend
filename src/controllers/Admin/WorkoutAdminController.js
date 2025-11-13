const WorkoutAdminService = require("../../services/Admin/WorkoutAdminService");

const createWorkout = async (req, res) => {
  try {
    const {
      userId,
      title,
      date,
      time,
      startTime,
      endTime,
      status,
      trainerId,
      membershipId,
      maxParticipants,
      location,
    } = req.body;

    if (
      !userId ||
      !userId ||
      !title ||
      !date ||
      !time ||
      !startTime ||
      !endTime
    ) {
      return res.status(400).json({
        status: "ERROR",
        message: "Thiếu thông tin cần thiết",
      });
    }

    const resCreate = await WorkoutAdminService.createWorkout({
      userId,
      title,
      date,
      time,
      startTime,
      endTime,
      status,
      trainerId,
      membershipId,
      maxParticipants,
      location,
    });

    return res.status(200).json(resCreate);
  } catch (error) {
    console.error("Lỗi tạo membership:", error);
    return res.status(500).json({
      status: "ERROR",
      message: "Lỗi máy chủ, vui lòng thử lại sau",
    });
  }
};

module.exports = {
  createWorkout,
};
