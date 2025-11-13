const Package = require("../../models/Package/package");
const User = require("../../models/User/User");

const createPackage = (newPackage) => {
  return new Promise(async (resolve, reject) => {
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
      } = newPackage;

      if (type === "personal_trainer") {
        if (!trainerId) {
          return resolve({
            status: "ERROR",
            message: "Gói huấn luyện viên cá nhân cần có trainerId.",
          });
        }

        const trainer = await User.findById(trainerId);
        if (!trainer || trainer.role !== "trainer") {
          return resolve({
            status: "ERROR",
            message: "Trainer không hợp lệ hoặc không tồn tại.",
          });
        }
      }

      if (maxMembers <= 0) {
        return resolve({
          status: "ERROR",
          message: "Số lượng thành viên tối đa phải lớn hơn 0.",
        });
      }

      const createdPackage = await Package.create({
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

      resolve({
        status: "OK",
        message: "Tạo gói tập thành công.",
        data: createdPackage,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updatePackage = (packageId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkPackage = await Package.findOne({
        _id: packageId,
      });

      if (checkPackage === null) {
        resolve({
          status: "ERROR",
          message: "Package khong ton tai",
        });
      } else {
        const updatePackage = await Package.findByIdAndUpdate(
          checkPackage._id,
          data,
          {
            new: true,
          }
        );

        resolve({
          status: "OK",
          message: "Cập nhật thành công",
          data: updatePackage,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const deletePackage = (packageId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkPackage = await Package.findOne({
        _id: packageId,
      });

      if (checkPackage === null) {
        resolve({
          status: "ERROR",
          message: "Package khong ton tai",
        });
      } else {
        const deletePackage = await Package.findByIdAndDelete(
          checkPackage._id,
          {
            new: true,
          }
        );

        resolve({
          status: "OK",
          message: "Xóa thành công",
          data: deletePackage,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllPackages = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const getPackage = await Package.find();

      resolve({
        status: "OK",
        message: "Lấy tất cả thành công",
        data: getPackage,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailsPackage = (packageId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkPackage = await Package.findOne({
        _id: packageId,
      });

      if (checkPackage === null) {
        resolve({
          status: "ERROR",
          message: "Package khong ton tai",
        });
      } else {
        resolve({
          status: "OK",
          message: "Xóa thành công",
          data: checkPackage,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createPackage,
  updatePackage,
  deletePackage,
  getAllPackages,
  getDetailsPackage,
};
