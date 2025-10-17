const User = require("../../models/User/User");
const bcrypt = require("bcryptjs");

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
      console.log("comparePassword: ", commparePassword);

      if (!commparePassword) {
        resolve({
          status: "ERROR",
          message: "Mat khau khong dung",
        });
      } else {
        resolve({
          status: "OK",
          message: "Dang nhap thanh cong",
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
};
