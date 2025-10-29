const User = require("../../models/User/User");
const HealthInfo = require("../../models/HealthInfo/HealthInfo");


exports.updateOrCreateHealthInfo = async (userId, data) => {
  const { height, weight, medicalHistory, fitnessGoal } = data;

  // Tìm user
  const user = await User.findById(userId);
  if (!user) {
    return {
        success: false,
        message: "Không tìm thấy người dùng",
      };
  }

  let healthInfo;

  // Nếu user đã có healthInfo → cập nhật
  if (user.healthInfo) {
    healthInfo = await HealthInfo.findById(user.healthInfo);
    if (!healthInfo) {
      return {
        success: false,
        message: "Không tìm thấy thông tin sức khỏe",
      };
    }

    healthInfo.height = height;
    healthInfo.weight = weight;
    healthInfo.medicalHistory = medicalHistory;
    healthInfo.fitnessGoal = fitnessGoal;
    await healthInfo.save();

    return {
      success: true,
      message: "Cập nhật thông tin sức khỏe thành công",
      data: healthInfo,
    }

  } else {
    // Nếu chưa có → tạo mới
    healthInfo = new HealthInfo({
      height,
      weight,
      medicalHistory,
      fitnessGoal,
    });
    await healthInfo.save();

    // Gán vào user
    user.healthInfo = healthInfo._id;
    await user.save();

    return {
      success: true,
      message: "Tạo thông tin sức khỏe thành công",
      data: healthInfo,
    }
  }
};
