const PackageAdminService = require("../../services/Admin/PackageAdminService");

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

    const resPackage = await PackageAdminService.createPackage({
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

    return res.status(200).json(resPackage);
  } catch (error) {
    console.error("Lỗi tạo package:", error);
    return res.status(500).json({
      status: "ERROR",
      message: "Lỗi máy chủ, vui lòng thử lại sau",
    });
  }
};

const updatePackage = async (req, res) => {
  try {
    const packageId = req.params.id;
    const data = req.body;

    if (!packageId) {
      return res.status(400).json({
        status: "ERROR",
        message: "packageId khong hop le",
      });
    }

    const resPackage = await PackageAdminService.updatePackage(packageId, data);

    return res.status(200).json(resPackage);
  } catch (error) {
    console.error("Lỗi sửa package:", error);
    return res.status(500).json({
      status: "ERROR",
      message: "Lỗi máy chủ, vui lòng thử lại sau",
    });
  }
};

const deletePackage = async (req, res) => {
  try {
    const packageId = req.params.id;

    if (!packageId) {
      return res.status(400).json({
        status: "ERROR",
        message: "packageId khong hop le",
      });
    }

    const resPackage = await PackageAdminService.deletePackage(packageId);

    return res.status(200).json(resPackage);
  } catch (error) {
    console.error("Lỗi xóa package:", error);
    return res.status(500).json({
      status: "ERROR",
      message: "Lỗi máy chủ, vui lòng thử lại sau",
    });
  }
};
 
const getAllPackages = async (req, res) => {
  try {
    const resPackage = await PackageAdminService.getAllPackages();
    return res.status(200).json(resPackage);
  } catch (error) {
    console.error("Lỗi sửa package:", error);
    return res.status(500).json({
      status: "ERROR",
      message: "Lỗi máy chủ, vui lòng thử lại sau",
    });
  }
};

const getDetailsPackage = async (req, res) => {
  try {
    const packageId = req.params.id;

    if (!packageId) {
      return res.status(400).json({
        status: "ERROR",
        message: "packageId khong hop le",
      });
    }

    const resPackage = await PackageAdminService.getDetailsPackage(packageId);

    return res.status(200).json(resPackage);
  } catch (error) {
    console.error("Lỗi sửa package:", error);
    return res.status(500).json({
      status: "ERROR",
      message: "Lỗi máy chủ, vui lòng thử lại sau",
    });
  }
};

module.exports = {
  createPackage,
  updatePackage,
  deletePackage,
  getAllPackages,
  getDetailsPackage,
};
