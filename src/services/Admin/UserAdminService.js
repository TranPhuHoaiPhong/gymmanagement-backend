const User = require("../../models/User/User");
const bcrypt = require("bcryptjs");
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
      } = newUser;

      const checkUser = await User.findOne({
        email: email,
      });

      if (checkUser !== null) {
        resolve({
          status: "ERROR",
          message: "Email da ton tai",
        });
      } else {
        const hash = bcrypt.hashSync(passwordHash, 10);
        const createdUser = await User.create({
          fullName,
          dateOfBirth,
          gender,
          email,
          phone,
          passwordHash: hash,
          role,
          isAdmin: role === "admin" ? true : false,
          isStaff: role === "staff" ? true : false,
          isTrainer: role === "trainer" ? true : false,
        });

        if (createdUser) {
          resolve({
            status: "OK",
            message: "SUCCESS",
            data: createdUser,
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

const loginUser = (userLogin) => {
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
      } = userLogin;

      const checkUser = await User.findOne({
        email: email,
      });

      if (checkUser === null) {
        resolve({
          status: "ERROR",
          message: "Email khong ton tai",
        });
      }

      const commparePassword = bcrypt.compareSync(
        passwordHash,
        checkUser.passwordHash
      );

      if (!commparePassword) {
        resolve({
          status: "ERROR",
          message: "Mat khau khong dung",
        });
      } else {
        const access_Token = await genneralAccessToken({
          id: checkUser._id,
          isAdmin: checkUser.isAdmin,
        });

        const refresh_Token = await genneralRefreshToken({
          id: checkUser._id,
          isAdmin: checkUser.isAdmin,
        });

        resolve({
          status: "OK",
          message: "Dang nhap thanh cong",
          access_Token,
          refresh_Token,
        });
      }
    } catch (e) {
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

const getAllUsers = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const users = await User.find();
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

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getDetailsUser,
};
