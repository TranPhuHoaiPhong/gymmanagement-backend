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

module.exports = {
  createUser,
};
