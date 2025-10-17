const UserAdminService = require("../../services/Admin/UserAdminService");

const createUser = async (req, res) => {
  try {
    const { fullName, dateOfBirth, gender, email, phone, passwordHash, role } =
      req.body;
    const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const regexPhone = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    const isCheckEmail = regexEmail.test(email);
    if (
      !fullName ||
      !dateOfBirth ||
      !gender ||
      !email ||
      !phone ||
      !passwordHash ||
      !role
    ) {
      return res.status(400).json({
        status: "ERROR",
        message: "Thieu thong tin",
      });
    } else if (!isCheckEmail) {
      return res.status(400).json({
        status: "ERROR",
        message: "Email khong hop le",
      });
    }
    const resCreate = await UserAdminService.createUser(req.body);
    return res.status(200).json(resCreate);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, passwordHash } = req.body;
    const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const regexPhone = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    const isCheckEmail = regexEmail.test(email);
    if (!email || !passwordHash) {
      return res.status(400).json({
        status: "ERROR",
        message: "Thieu thong tin",
      });
    } else if (!isCheckEmail) {
      return res.status(400).json({
        status: "ERROR",
        message: "Email khong hop le",
      });
    }
    const resCreate = await UserAdminService.loginUser(req.body);
    return res.status(200).json(resCreate);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createUser,
  loginUser,
};
