const CheckInLog = require("../../models/CheckInLogModel/CheckInLogModel");

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

module.exports = {
  getAllCheckInLogs,
};
