const Membership = require("../../models/Membership/membership");
const TrainerSession = require("../../models/TrainerSession/TrainerSession");
const User = require("../../models/User/User");

const createTrainerSession = (newTrainerSession) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { membershipId, trainerId, userId, sessionDate } =
        newTrainerSession;

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
          message: "Membership chưa được kích hoạt hoặc đã hết hạn.",
        });
      }

      const trainer = await User.findById(trainerId);
      if (!trainer || trainer.role !== "trainer") {
        return resolve({
          status: "ERROR",
          message: "Huấn luyện viên không hợp lệ.",
        });
      }

      const user = await User.findById(userId);
      if (!user || user.role !== "member") {
        return resolve({
          status: "ERROR",
          message: "Người dùng không hợp lệ.",
        });
      }

      if (new Date(sessionDate) < new Date()) {
        return resolve({
          status: "ERROR",
          message: "Không thể tạo buổi tập trong quá khứ.",
        });
      }

      const existingSession = await TrainerSession.findOne({
        trainerId,
        sessionDate: new Date(sessionDate),
      });

      if (existingSession) {
        return resolve({
          status: "ERROR",
          message: "Huấn luyện viên đã có buổi tập trong ngày này.",
        });
      }

      const createdTrainerSession = await TrainerSession.create({
        membershipId,
        trainerId,
        userId,
        sessionDate,
      });

      resolve({
        status: "OK",
        message: "Tạo TrainerSession thành công.",
        data: createdTrainerSession,
      });
    } catch (error) {
      console.error("Lỗi trong createTrainerSession:", error);
      reject({
        status: "ERROR",
        message: "Lỗi máy chủ khi tạo TrainerSession.",
      });
    }
  });
};

module.exports = {
  createTrainerSession,
};
