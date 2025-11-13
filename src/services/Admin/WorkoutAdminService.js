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
        trainerId,
        membershipId,
        title,
        date,
        startTime,
        endTime,
        notes,
        location,
        maxParticipants,
      });

      resolve({
        status: "OK",
        message: "Tạo workout thành công",
        // data: createdWorkout,
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

module.exports = {
  createWorkout,
};
