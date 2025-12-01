const Package = require("../../models/Package/package");
const GroupSession = require("../../models/GroupSessionModel/GroupSessionModel");
const User = require("../../models/User/User");

const createGroupSession = (newGroupSession) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        title,
        packageId,
        trainerId,
        date,
        startTime,
        endTime,
        location,
        capacity,
      } = newGroupSession;

      // 1. Kiểm tra package tồn tại
      const checkPackage = await Package.findById(packageId);
      if (!checkPackage) {
        return resolve({
          status: "ERROR",
          message: "Package không tồn tại.",
        });
      }

      // 2. Kiểm tra trainer
      const trainer = await User.findById(trainerId);
      if (!trainer || trainer.role !== "trainer") {
        return resolve({
          status: "ERROR",
          message: "Huấn luyện viên không hợp lệ.",
        });
      }

      // 3. Ngăn tạo buổi tập quá khứ
      if (new Date(date) < new Date()) {
        return resolve({
          status: "ERROR",
          message: "Không thể tạo buổi tập trong quá khứ.",
        });
      }

      // 4. Kiểm tra trùng lịch buổi tập
      const existingSession = await GroupSession.findOne({
        trainerId,
        date: new Date(date),
      });

      if (existingSession) {
        return resolve({
          status: "ERROR",
          message: "Huấn luyện viên đã có buổi tập trong ngày này.",
        });
      }

      // 5. Tạo buổi tập
      const createdGroupSession = await GroupSession.create({
        title,
        packageId,
        trainerId,
        date,
        startTime,
        endTime,
        location,
        capacity,
        membersAllowed: [],
        membersCheckedIn: [],
      });

      resolve({
        status: "OK",
        message: "Tạo GroupSession thành công.",
        data: createdGroupSession,
      });
    } catch (error) {
      console.error("Lỗi trong createGroupSession:", error);
      reject({
        status: "ERROR",
        message: "Lỗi máy chủ khi tạo GroupSession.",
      });
    }
  });
};

const joinGroupSession = ({ userId, sessionId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      // 1. Check user
      const checkUser = await User.findById(userId);
      if (!checkUser) {
        return resolve({
          status: "ERROR",
          message: "Người dùng không tồn tại.",
        });
      }

      if (checkUser.role !== "member") {
        return resolve({
          status: "ERROR",
          message: "Người dùng không phải là member.",
        });
      }

      // 2. Check session
      const checkSession = await GroupSession.findById(sessionId);
      if (!checkSession) {
        return resolve({
          status: "ERROR",
          message: "Buổi tập không tồn tại.",
        });
      }

      // 3. Kiểm tra đã đăng ký chưa
      const alreadyJoined = checkSession.membersAllowed.includes(userId);
      if (alreadyJoined) {
        return resolve({
          status: "ERROR",
          message: "Bạn đã đăng ký buổi tập này rồi.",
        });
      }

      // 4. Kiểm tra đủ số lượng chưa
      if (checkSession.membersAllowed.length >= checkSession.capacity) {
        return resolve({
          status: "ERROR",
          message: "Buổi tập đã đầy.",
        });
      }

      // 5. Thêm user vào membersAllowed
      checkSession.membersAllowed.push(userId);
      await checkSession.save();

      resolve({
        status: "OK",
        message: "Đăng ký buổi tập thành công.",
        data: checkSession,
      });
    } catch (error) {
      console.error("Lỗi trong joinGroupSession:", error);
      reject({
        status: "ERROR",
        message: "Lỗi máy chủ khi đăng ký GroupSession.",
      });
    }
  });
};

module.exports = {
  createGroupSession,
  joinGroupSession,
  //   updateGroupSession,
  //   getAllGroupSessions,
  //   getDetailsGroupSession,
};
