const Membership = require("../../models/Membership/Membership");
const Package = require("../../models/Package/package");
const User = require("../../models/User/User");

const createMembership = (newMembership) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { userId, packageId, trainerId, startDate } = newMembership;

      const packageData = await Package.findById(packageId);
      if (!packageData) {
        return resolve({
          status: "ERROR",
          message: "Gói tập không tồn tại",
        });
      }

      const userData = await User.findById(userId);
      if (!userData) {
        return resolve({
          status: "ERROR",
          message: "Người dùng không tồn tại",
        });
      }

      if (packageData.type === "personal_trainer") {
        if (!trainerId) {
          return resolve({
            status: "ERROR",
            message: "Gói này yêu cầu huấn luyện viên (trainerId)",
          });
        }

        const trainerData = await User.findById(trainerId);
        if (!trainerData || trainerData.role !== "trainer") {
          return resolve({
            status: "ERROR",
            message: "Huấn luyện viên không hợp lệ",
          });
        }
      }

      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + packageData.durationInDays);

      const createdMembership = await Membership.create({
        userId,
        packageId,
        trainerId: packageData.type === "personal_trainer" ? trainerId : null,
        startDate: start,
        endDate: end,
        status: "active",
        remainingSessions:
          packageData.type === "personal_trainer"
            ? packageData.sessionsWithTrainer
            : 0,
      });

      resolve({
        status: "OK",
        message: "Tạo membership thành công",
        data: createdMembership,
      });
    } catch (error) {
      console.error("Lỗi trong createMembership:", error);
      reject({
        status: "ERROR",
        message: "Lỗi máy chủ khi tạo membership",
      });
    }
  });
};

const updateMembership = (membershipId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkMembership = await Membership.findOne({
        _id: membershipId,
      });

      if (checkMembership === null) {
        resolve({
          status: "ERROR",
          message: "Membership khong ton tai",
        });
      } else {
        const updateMembership = await Membership.findByIdAndUpdate(
          checkMembership._id,
          data,
          {
            new: true,
          }
        );

        resolve({
          status: "OK",
          message: "Cập nhật thành công",
          data: updateMembership,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const deleteMembership = (membershipId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkMembership = await Membership.findOne({
        _id: membershipId,
      });

      if (checkMembership === null) {
        resolve({
          status: "ERROR",
          message: "Membership khong ton tai",
        });
      } else {
        const deleteMembership = await Membership.findByIdAndDelete(
          checkMembership._id
        );

        resolve({
          status: "OK",
          message: "Xóa thành công",
          data: deleteMembership,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllMembership = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const getAllMemberships = await Membership.find();

      resolve({
        status: "OK",
        message: "Lấy tất cả hành công",
        data: getAllMemberships,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailsMembership = (membershipId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkMembership = await Membership.findOne({
        _id: membershipId,
      });

      if (checkMembership === null) {
        resolve({
          status: "ERROR",
          message: "Membership khong ton tai",
        });
      } else {
        resolve({
          status: "OK",
          message: "Lấy thông tin thành công",
          data: checkMembership,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createMembership,
  updateMembership,
  deleteMembership,
  getAllMembership,
  getDetailsMembership,
};
