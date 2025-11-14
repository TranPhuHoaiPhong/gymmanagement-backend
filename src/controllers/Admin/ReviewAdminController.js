const ReviewAdminService = require("../../services/Admin/ReviewAdminService");

const createReiview = async (req, res) => {
  try {
    const { member, trainer, rating, comment, targetType } = req.body;

    if (!member || !trainer || !rating || !comment) {
      return res.status(400).json({
        status: "ERROR",
        message: "Thiếu thông tin cần thiết",
      });
    }

    const resCreate = await ReviewAdminService.createReiview({
      member,
      trainer,
      rating,
      comment,
      targetType,
    });

    return res.status(200).json(resCreate);
  } catch (error) {
    console.error("Lỗi tạo Review:", error);

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
  createReiview,
};
