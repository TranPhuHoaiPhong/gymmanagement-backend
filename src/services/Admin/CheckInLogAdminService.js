const CheckInLog = require("../../models/CheckInLogModel/CheckInLogModel");
const GroupSession = require("../../models/GroupSessionModel/GroupSessionModel");
const TrainerSession = require("../../models/TrainerSession/TrainerSession");
const Membership = require("../../models/Membership/Membership");
const User = require("../../models/User/User");

const getAllCheckInLogs = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const getCheckInLog = await CheckInLog.find();

      resolve({
        status: "OK",
        message: "Lấy tất cả thành công",
        data: getCheckInLog,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getMembersBySession = (sessionId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let groupSession = await GroupSession.findById(sessionId).populate(
        "membersAllowed"
      );
      if (groupSession) {
        return resolve({
          status: "OK",
          message: "Lấy thành viên group session thành công",
          data: groupSession.membersAllowed,
        });
      }

      let trainerSession = await TrainerSession.findById(sessionId).populate(
        "userId"
      );
      if (trainerSession) {
        return resolve({
          status: "OK",
          message: "Lấy thành viên trainer session thành công",
          data: [trainerSession.userId],
        });
      }

      resolve({
        status: "ERR",
        message: "Session không tồn tại",
        data: [],
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  getAllCheckInLogs,
  getMembersBySession,
};
