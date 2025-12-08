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

exports.updateHealthInfo = async (userId, data) => {
  const { height, weight, medicalHistory, fitnessGoal } = data;

  // Tìm user
  const user = await User.findById(userId);
  if (!user) {
    return {
      success: false,
      message: "Không tìm thấy người dùng",
    };
  }

  // Kiểm tra user đã có healthInfo chưa
  if (!user.healthInfo) {
    return {
      success: false,
      message: "Người dùng chưa có thông tin sức khỏe để cập nhật",
    };
  }

  // Tìm healthInfo
  const healthInfo = await HealthInfo.findById(user.healthInfo);
  if (!healthInfo) {
    return {
      success: false,
      message: "Không tìm thấy thông tin sức khỏe",
    };
  }

  // Cập nhật các trường
  if (height !== undefined) healthInfo.height = height;
  if (weight !== undefined) healthInfo.weight = weight;
  if (medicalHistory !== undefined) healthInfo.medicalHistory = medicalHistory;
  if (fitnessGoal !== undefined) healthInfo.fitnessGoal = fitnessGoal;

  await healthInfo.save();

  return {
    success: true,
    message: "Cập nhật thông tin sức khỏe thành công",
    data: healthInfo,
  };
};

exports.getHealthInfo = async (userId) => {
  try {
    // Tìm user
    const user = await User.findById(userId).populate("healthInfo");

    if (!user) {
      return {
        success: false,
        message: "Không tìm thấy người dùng",
      };
    }

    // Nếu user chưa có healthInfo
    if (!user.healthInfo) {
      return {
        success: true,
        message: "Người dùng chưa có thông tin sức khỏe",
        data: null,
      };
    }

    // Trả về healthInfo đã populate
    return {
      success: true,
      message: "Lấy thông tin sức khỏe thành công",
      data: user.healthInfo,
    };

  } catch (error) {
    return {
      success: false,
      message: "Lỗi khi lấy thông tin sức khỏe",
      error: error.message,
    };
  }
};
