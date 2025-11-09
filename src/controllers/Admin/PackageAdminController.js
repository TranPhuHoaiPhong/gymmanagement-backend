const createPackage = async (req, res) => {
  try {
    const {
      name,
      durationInDays,
      price,
      description,
      type,
      trainerId,
      sessionsWithTrainer,
      maxMembers,
      isActive,
    } = req.body;

    // Validate cơ bản
    if (!name || !durationInDays || !price || !type) {
      return res.status(400).json({
        status: "ERROR",
        message: "Thiếu thông tin cần thiết",
      });
    }

    // Gọi service để tạo user
    const resCreate = await UserAdminService.createUser({
      name,
      durationInDays,
      price,
      description,
      type,
      trainerId,
      sessionsWithTrainer,
      maxMembers,
      isActive,
    });

    return res.status(200).json(resCreate);
  } catch (error) {
    console.error("Lỗi tạo user:", error);
    return res.status(500).json({
      status: "ERROR",
      message: "Lỗi máy chủ, vui lòng thử lại sau",
    });
  }
};

module.exports = {
  createPackage,
};
