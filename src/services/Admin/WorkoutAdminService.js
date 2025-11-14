const Workout = require("../../models/Workout/workout");
const User = require("../../models/User/user");
const Membership = require("../../models/Membership/membership");

const createWorkout = (newWorkout) => {
  return new Promise(async (resolve, reject) => {
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
        notes,
        location,
      } = newWorkout;

      const checkUser = await User.findById(userId);
      if (!checkUser) {
        return resolve({
          status: "ERROR",
          message: "Người dùng không tồn tại.",
        });
      }

      if (trainerId) {
        const checkTrainer = await User.findById(trainerId);
        if (!checkTrainer || checkTrainer.role !== "trainer") {
          return resolve({
            status: "ERROR",
            message: "Huấn luyện viên không hợp lệ.",
          });
        }
      }

      if (membershipId) {
        const checkMembership = await Membership.findById(membershipId);
        if (!checkMembership) {
          return resolve({
            status: "ERROR",
            message: "Membership không tồn tại.",
          });
        }
        if (checkMembership.userId.toString() !== userId.toString()) {
          return resolve({
            status: "ERROR",
            message: "Membership không thuộc về người dùng này.",
          });
        }
        if (checkMembership.status !== "active") {
          return resolve({
            status: "ERROR",
            message: "Membership chưa kích hoạt hoặc đã hết hạn.",
          });
        }
      }

      if (new Date(startTime) >= new Date(endTime)) {
        return resolve({
          status: "ERROR",
          message: "Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc.",
        });
      }

      if (new Date(startTime) < new Date()) {
        return resolve({
          status: "ERROR",
          message: "Không thể tạo buổi tập trong quá khứ.",
        });
      }

      const overlappingWorkout = await Workout.findOne({
        trainerId,
        $or: [
          {
            startTime: { $lt: new Date(endTime) },
            endTime: { $gt: new Date(startTime) },
          },
        ],
      });

      if (overlappingWorkout) {
        return resolve({
          status: "ERROR",
          message:
            "Huấn luyện viên đã có buổi tập khác trong khoảng thời gian này.",
        });
      }

      const createdWorkout = await Workout.create({
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
        notes,
        location,
      });

      resolve({
        status: "OK",
        message: "Tạo workout thành công",
        data: createdWorkout,
      });
    } catch (error) {
      console.error("Lỗi trong createWorkout:", error);
      reject({
        status: "ERROR",
        message: "Lỗi máy chủ khi tạo Workout",
      });
    }
  });
};

const updateWorkout = (workoutId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkWorkout = await Workout.findById(workoutId);
      if (!checkWorkout) {
        return resolve({
          status: "ERROR",
          message: "Buổi tập không tồn tại.",
        });
      }

      if (
        checkWorkout.status === "completed" ||
        checkWorkout.status === "cancelled"
      ) {
        return resolve({
          status: "ERROR",
          message: "Không thể chỉnh sửa buổi tập đã hoàn thành hoặc đã hủy.",
        });
      }

      if (data.trainerId) {
        const checkTrainer = await User.findById(data.trainerId);
        if (!checkTrainer || checkTrainer.role !== "trainer") {
          return resolve({
            status: "ERROR",
            message: "Huấn luyện viên không hợp lệ.",
          });
        }
      }

      if (data.membershipId) {
        const checkMembership = await Membership.findById(data.membershipId);
        if (!checkMembership) {
          return resolve({
            status: "ERROR",
            message: "Membership không tồn tại.",
          });
        }
        if (
          checkMembership.userId.toString() !== checkWorkout.userId.toString()
        ) {
          return resolve({
            status: "ERROR",
            message: "Membership không thuộc về người dùng này.",
          });
        }
        if (checkMembership.status !== "active") {
          return resolve({
            status: "ERROR",
            message: "Membership chưa kích hoạt hoặc đã hết hạn.",
          });
        }
      }

      if (data.startTime && data.endTime) {
        if (new Date(data.startTime) >= new Date(data.endTime)) {
          return resolve({
            status: "ERROR",
            message: "Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc.",
          });
        }

        if (new Date(data.startTime) < new Date()) {
          return resolve({
            status: "ERROR",
            message: "Không thể đặt buổi tập trong quá khứ.",
          });
        }
      }

      if (data.trainerId || data.startTime || data.endTime) {
        const overlappingWorkout = await Workout.findOne({
          _id: { $ne: workoutId },
          trainerId: data.trainerId || checkWorkout.trainerId,
          $or: [
            {
              startTime: {
                $lt: new Date(data.endTime || checkWorkout.endTime),
              },
              endTime: {
                $gt: new Date(data.startTime || checkWorkout.startTime),
              },
            },
          ],
        });

        if (overlappingWorkout) {
          return resolve({
            status: "ERROR",
            message:
              "Huấn luyện viên đã có buổi tập khác trong khoảng thời gian này.",
          });
        }
      }

      const updatedWorkout = await Workout.findByIdAndUpdate(workoutId, data, {
        new: true,
      });

      resolve({
        status: "OK",
        message: "Cập nhật buổi tập thành công.",
        data: updatedWorkout,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getWorkouts = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const workouts = await Workout.find()
        .populate("trainerId", "name")
        .populate("userId", "name")
        .populate("membershipId", "type");
      resolve({
        status: "OK",
        message: "Lấy danh sách buổi tập thành công.",
        data: workouts,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailsWorkout = (workoutId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkWorkout = await Workout.findById(workoutId)
        .populate("trainerId", "name")
        .populate("userId", "name email")
        .populate("membershipId", "type");

      if (!checkWorkout) {
        return resolve({
          status: "ERROR",
          message: "Buổi tập không tồn tại.",
        });
      } else {
        return resolve({
          status: "OK",
          message: "Lấy chi tiết buổi tập thành công.",
          data: checkWorkout,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createWorkout,
  updateWorkout,
  getWorkouts,
  getDetailsWorkout,
};
