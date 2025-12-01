const GroupSessionAdminService = require("../../services/Admin/GroupSessionAdminService");

const createGroupSession = async (req, res) => {
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
    } = req.body;

    // console.log(req.body);

    // Validate fields
    if (!title || !packageId || !trainerId || !date) {
      return res.status(400).json({
        status: "ERROR",
        message: "Thiếu thông tin cần thiết",
      });
    }

    // Validate date format
    if (isNaN(Date.parse(date))) {
      return res.status(400).json({
        status: "ERROR",
        message: "Ngày không hợp lệ",
      });
    }

    // Call service
    const result = await GroupSessionAdminService.createGroupSession({
      title,
      packageId,
      trainerId,
      date,
      startTime,
      endTime,
      location,
      capacity,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Lỗi tạo GroupSession:", error);

    return res.status(500).json({
      status: "ERROR",
      message: "Lỗi máy chủ, vui lòng thử lại sau",
    });
  }
};

const joinGroupSession = async (req, res) => {
  try {
    const { userId } = req.body;
    const sessionId = req.params.id;

    if (!userId) {
      return res.status(400).json({
        status: "ERROR",
        message: "Thiếu thông tin cần thiết",
      });
    }
    if (!sessionId) {
      return res.status(400).json({
        status: "ERROR",
        message: "Thiếu ID GroupSession",
      });
    }

    // Call service
    const result = await GroupSessionAdminService.joinGroupSession({
      userId,
      sessionId,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Lỗi đăng kí GroupSession:", error);

    return res.status(500).json({
      status: "ERROR",
      message: "Lỗi máy chủ, vui lòng thử lại sau",
    });
  }
};

// const updateTrainersession = async (req, res) => {
//   try {
//     const trainersessionId = req.params.id;
//     const data = req.body;

//     if (!trainersessionId) {
//       return res.status(400).json({
//         status: "ERROR",
//         message: "Thiếu ID Trainersession cần cập nhật",
//       });
//     }

//     const resUpdate = await TrainerSessionAdminService.updateTrainerSession(
//       trainersessionId,
//       data
//     );

//     return res.status(200).json(resUpdate);
//   } catch (error) {
//     console.error("Lỗi cập nhật Trainersession:", error);

//     if (error?.status && error?.message) {
//       return res.status(400).json(error);
//     }
//   }
// };

// const getAllTrainersessions = async (req, res) => {
//   try {
//     const resGetAll = await TrainerSessionAdminService.getAllTrainerSessions();
//     return res.status(200).json(resGetAll);
//   } catch (error) {
//     console.error("Lỗi lấy tất cả Trainersessions:", error);
//     return res.status(500).json({
//       status: "ERROR",
//       message: "Lỗi máy chủ, vui lòng thử lại sau",
//     });
//   }
// };

// const getDetailsTrainersession = async (req, res) => {
//   try {
//     const trainersessionId = req.params.id;
//     const data = req.body;
//     if (!trainersessionId) {
//       return res.status(400).json({
//         status: "ERROR",
//         message: "Thiếu ID Trainersession cần lấy chi tiết",
//       });
//     }
//     const resGetDetails =
//       await TrainerSessionAdminService.getDetailsTrainerSession(
//         trainersessionId,
//         data
//       );
//     return res.status(200).json(resGetDetails);
//   } catch (error) {
//     console.error("Lỗi lấy chi tiết Trainersession:", error);
//     return res.status(500).json({
//       status: "ERROR",
//       message: "Lỗi máy chủ, vui lòng thử lại sau",
//     });
//   }
// };

module.exports = {
  createGroupSession,
  joinGroupSession,
  //   updateTrainersession,
  //   getAllTrainersessions,
  //   getDetailsTrainersession,
};
