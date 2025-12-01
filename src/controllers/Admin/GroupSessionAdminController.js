const TrainerSessionAdminService = require("../../services/Admin/TrainerSessionAdminService");

const createGroupsession = async (req, res) => {
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

    // Kiểm tra thông tin cần thiết
    if (!title || !packageId || !trainerId || !date) {
      return res.status(400).json({
        status: "ERROR",
        message: "Thiếu thông tin cần thiết",
      });
    }

    // Gọi service tạo GroupSession
    const resCreate = await GroupSessionAdminService.createGroupsession({
      title,
      packageId,
      trainerId,
      date,
      startTime,
      endTime,
      location,
      capacity,
    });

    return res.status(200).json(resCreate);
  } catch (error) {
    console.error("Lỗi tạo GroupSession:", error);

    if (error?.status && error?.message) {
      return res.status(400).json(error);
    }

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
  createGroupsession,
  //   updateTrainersession,
  //   getAllTrainersessions,
  //   getDetailsTrainersession,
};
