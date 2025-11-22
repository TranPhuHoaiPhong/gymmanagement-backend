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
      const getPackage = await Package.find()
        .populate("trainerId", "fullName")
        .lean();

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

const searchPackages = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        name,
        type,
        isActive,
        minPrice,
        maxPrice,
        minDuration,
        maxDuration,
        trainerId,
      } = data;

      const filters = {};

      // Tìm theo tên (Không phân biệt hoa thường)
      if (name) {
        filters.name = { $regex: name, $options: "i" };
      }

      // Loại gói: standard | personal_trainer
      if (type) {
        filters.type = type;
      }

      // Trạng thái
      if (isActive === "true") filters.isActive = true;
      if (isActive === "false") filters.isActive = false;

      // Giá tối thiểu
      if (minPrice) {
        filters.price = { ...filters.price, $gte: Number(minPrice) };
      }

      // Giá tối đa
      if (maxPrice) {
        filters.price = { ...filters.price, $lte: Number(maxPrice) };
      }

      // Duration min
      if (minDuration) {
        filters.durationInDays = {
          ...filters.durationInDays,
          $gte: Number(minDuration),
        };
      }

      // Duration max
      if (maxDuration) {
        filters.durationInDays = {
          ...filters.durationInDays,
          $lte: Number(maxDuration),
        };
      }

      // Lọc theo trainer (chỉ PT packages)
      if (trainerId) {
        filters.trainerId = trainerId;
      }

      const searchPackages = await Package.find(filters);

      resolve({
        status: "OK",
        message: "Tìm kiếm thành công",
        data: searchPackages,
      });
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
  searchPackages,
};
