const User = require("../../models/User/User");
const bcrypt = require("bcryptjs");
const sendEmail = require("../../services/utils/sendEmail");
const {
  genneralAccessToken,
  genneralRefreshToken,
} = require("../JwtService/JwtService");

const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        fullName,
        dateOfBirth,
        gender,
        email,
        phone,
        passwordHash,
        role,
        avatarUrl,
        trainerProfile,
      } = newUser;

      const checkUser = await User.findOne({ email });
      if (checkUser !== null) {
        return resolve({ status: "ERROR", message: "Email đã tồn tại" });
      }

      const checkPhone = await User.findOne({ phone });
      if (checkPhone) {
        return resolve({
          status: "ERROR",
          message: "Số điện thoại đã tồn tại",
        });
      }

      const dob = new Date(dateOfBirth);
      if (isNaN(dob.getTime())) {
        return resolve({ status: "ERROR", message: "Ngày sinh không hợp lệ" });
      }
      const today = new Date();
      if (dob > today) {
        return resolve({
          status: "ERROR",
          message: "Ngày sinh không được ở tương lai",
        });
      }

      const hash = bcrypt.hashSync(passwordHash, 10);

      const createdUser = await User.create({
        fullName,
        dateOfBirth: dob,
        gender,
        email,
        phone,
        passwordHash: hash,
        role,
        avatarUrl,
        trainerProfile,
      });

      return resolve({
        status: "OK",
        message: "SUCCESS",
        data: createdUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const loginUser = (userLogin) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Nhận password (mật khẩu thô từ client), không phải passwordHash
      const { email, passwordHash } = userLogin;

      const checkUser = await User.findOne({ email: email });

      // Nếu không tồn tại user
      if (checkUser === null) {
        return resolve({
          status: "ERROR",
          message: "Email khong ton tai",
        });
      }

      const comparePassword = bcrypt.compareSync(
        passwordHash,
        checkUser.passwordHash
      );

      if (!comparePassword) {
        return resolve({
          status: "ERROR",
          message: "Mat khau khong dung",
        });
      } else {
        // Tạo token (gửi role thay vì isAdmin)
        const access_Token = await genneralAccessToken({
          id: checkUser._id,
          role: checkUser.role,
        });

        const refresh_Token = await genneralRefreshToken({
          id: checkUser._id,
          role: checkUser.role,
        });

        return resolve({
          status: "OK",
          message: "Dang nhap thanh cong",
          access_Token,
          refresh_Token,
        });
      }
    } catch (e) {
      console.error("Lỗi loginUser:", e);
      reject(e);
    }
  });
};

const updateUser = (userId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
        _id: userId,
      });

      if (checkUser === null) {
        resolve({
          status: "ERROR",
          message: "User khong ton tai",
        });
      } else {
        const updatedUser = await User.findByIdAndUpdate(checkUser._id, data, {
          new: true,
        });
        resolve({
          status: "OK",
          message: "Cập nhật thành công",
          data: updatedUser,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const deleteUser = (userId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
        _id: userId,
      });

      if (checkUser === null) {
        resolve({
          status: "ERROR",
          message: "User khong ton tai",
        });
      } else {
        const deletedUser = await User.findByIdAndUpdate(checkUser._id, data, {
          new: true,
        });
        resolve({
          status: "OK",
          message: "Xóa thành công",
          data: deletedUser,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllUsers = (limit, page) => {
  // sort
  // console.log("Sort query:", sort);
  return new Promise(async (resolve, reject) => {
    try {
      const totalUsers = await User.countDocuments();
      const users = await User.find()
        .limit(limit)
        .skip(page * limit);
      // .sort({
      //   fullName: sort,
      // });

      resolve({
        status: "OK",
        message: "Lấy danh sách thành công",
        data: users,
        total: totalUsers,
        pageCurrent: Number(page) + 1,
        totalPage: Math.ceil(totalUsers / limit),
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllUsersMember = (limit, page) => {
  // sort
  // console.log("Sort query:", sort);
  return new Promise(async (resolve, reject) => {
    try {
      const totalUsers = await User.countDocuments();
      const users = await User.find()
        .limit(limit)
        .skip(page * limit);
      // .sort({
      //   fullName: sort,
      // });

      resolve({
        status: "OK",
        message: "Lấy danh sách thành công",
        data: users,
        total: totalUsers,
        pageCurrent: Number(page) + 1,
        totalPage: Math.ceil(totalUsers / limit),
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllTrainers = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const users = await User.find({
        role: "trainer",
      });

      resolve({
        status: "OK",
        message: "Lấy danh sách thành công",
        data: users,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllMembers = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const users = await User.find({
        role: "member",
      }).populate([{ path: "healthInfo" }, { path: "membership" }]);

      resolve({
        status: "OK",
        message: "Lấy danh sách thành công",
        data: users,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllMembersAndStaffs = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // Lấy cả member và staff
      const users = await User.find({
        role: { $in: ["member", "staff"] },
      }).populate([{ path: "healthInfo" }, { path: "membership" }]);

      resolve({
        status: "OK",
        message: "Lấy danh sách thành công",
        data: users,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllMembersAndStaffsAdmin = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const users = await User.find({
        role: { $in: ["member", "staff", "admin"] },
        _id: { $ne: userId },
      });

      resolve({
        status: "OK",
        message: "Lấy danh sách thành công",
        data: users,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllStaffs = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const users = await User.find({
        role: "staff",
      });

      resolve({
        status: "OK",
        message: "Lấy danh sách thành công",
        data: users,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailsUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
        _id: userId,
      });
      if (checkUser === null) {
        resolve({
          status: "ERROR",
          message: "User khong ton tai",
        });
      } else {
        resolve({
          status: "OK",
          message: "Lấy thông tin thành công",
          data: checkUser,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailsTrainer = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
        _id: userId,
      });
      if (checkUser === null) {
        return resolve({
          status: "ERROR",
          message: "User khong ton tai",
        });
      }

      if (checkUser.role !== "trainer") {
        return resolve({
          status: "ERROR",
          message: "User khong phai la trainer",
        });
      }

      resolve({
        status: "OK",
        message: "Lấy thông tin thành công",
        data: checkUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailsMember = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
        _id: userId,
      });
      if (checkUser === null) {
        return resolve({
          status: "ERROR",
          message: "User khong ton tai",
        });
      }

      if (checkUser.role !== "member") {
        return resolve({
          status: "ERROR",
          message: "User khong phai la member",
        });
      }

      resolve({
        status: "OK",
        message: "Lấy thông tin thành công",
        data: checkUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const uploadAvatar = async (userId, file) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(userId);

      if (!user) {
        return resolve({
          status: "ERROR",
          message: "User không tồn tại",
        });
      }

      // Convert path thành URL public
      const fileName = file.filename;
      const avatarUrl = `/images/avatar/${fileName}`;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { avatarUrl },
        { new: true }
      );

      resolve({
        status: "OK",
        message: "Upload avatar thành công",
        data: updatedUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const resetPasswordUser = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return resolve({
          status: "ERR",
          message: "Email không tồn tại trong hệ thống",
        });
      }

      const newPassword = Math.random().toString(36).slice(-8);

      // Hash password mới
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      user.passwordHash = hashedPassword;
      await user.save();

      // Gửi email
      await sendEmail({
        to: user.email,
        subject: "Khôi phục mật khẩu GYM2P",
        html: `
          <h3>Mật khẩu mới của bạn</h3>
          <p>Email: <b>${user.email}</b></p>
          <p>Mật khẩu mới: <b>${newPassword}</b></p>
          <p>Vui lòng đăng nhập và đổi mật khẩu ngay sau khi đăng nhập.</p>
        `,
      });

      resolve({
        status: "OK",
        message: "Mật khẩu mới đã được gửi vào email của khách hàng!",
      });
    } catch (e) {
      console.log("Reset password error:", e);
      reject(e);
    }
  });
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getDetailsUser,
  getAllTrainers,
  getAllMembers,
  uploadAvatar,
  getAllStaffs,
  getDetailsTrainer,
  getDetailsMember,
  resetPasswordUser,
  getAllMembersAndStaffs,
  getAllMembersAndStaffsAdmin,
};
