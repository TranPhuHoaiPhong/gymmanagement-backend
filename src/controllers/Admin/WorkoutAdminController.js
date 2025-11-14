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

    if (!userId || !title || !date || !time || !startTime || !endTime) {
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

const updateWorkout = async (req, res) => {
  try {
    const workoutId = req.params.id;
    const data = req.body;

    if (!workoutId) {
      return res.status(400).json({
        status: "ERROR",
        message: "Thiếu ID buổi tập",
      });
    }

    const updatedWorkout = await WorkoutAdminService.updateWorkout(
      workoutId,
      data
    );

    return res.status(200).json(updatedWorkout);
  } catch (error) {
    console.error("Lỗi cập nhật workout:", error);
    return res.status(500).json({
      status: "ERROR",
      message: "Lỗi máy chủ, vui lòng thử lại sau",
    });
  }
};

const getWorkouts = async (req, res) => {
  try {
    const workouts = await WorkoutAdminService.getWorkouts();
    return res.status(200).json(workouts);
  } catch (error) {
    console.error("Lỗi lấy danh sách workout:", error);
    return res.status(500).json({
      status: "ERROR",
      message: "Lỗi máy chủ, vui lòng thử lại sau",
    });
  }
};

const getDetailsWorkout = async (req, res) => {
  try {
    const workoutId = req.params.id;
    if (!workoutId) {
      return res.status(400).json({
        status: "ERROR",
        message: "Thiếu ID buổi tập",
      });
    }
    const workout = await WorkoutAdminService.getDetailsWorkout(workoutId);
    return res.status(200).json(workout);
  } catch (error) {
    console.error("Lỗi lấy chi tiết workout:", error);
    return res.status(500).json({
      status: "ERROR",
      message: "Lỗi máy chủ, vui lòng thử lại sau",
    });
  }
};

module.exports = {
  createWorkout,
  updateWorkout,
  getWorkouts,
  getDetailsWorkout,
};
