const UserAdminService = require("../../services/Admin/UserAdminService");
const JwtService = require("../../services/JwtService/JwtService");

const createUser = async (req, res) => {
  try {
    const { fullName, dateOfBirth, gender, email, phone, passwordHash, role } =
      req.body;

    // Kiểm tra định dạng
    const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const regexPhone = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;

    // Validate cơ bản
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
        message: "Thiếu thông tin cần thiết",
      });
    }

    if (!regexEmail.test(email)) {
      return res.status(400).json({
        status: "ERROR",
        message: "Email không hợp lệ",
      });
    }

    if (!regexPhone.test(phone)) {
      return res.status(400).json({
        status: "ERROR",
        message: "Số điện thoại không hợp lệ",
      });
    }

    // Gọi service để tạo user
    const resCreate = await UserAdminService.createUser({
      fullName,
      dateOfBirth,
      gender,
      email,
      phone,
      passwordHash,
      role,
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

const loginUser = async (req, res) => {
  try {
    const { email, passwordHash } = req.body;
    console.log(req.body);
    const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
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
    const resLogin = await UserAdminService.loginUser(req.body);
    return res.status(200).json(resLogin);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;

    if (!userId) {
      return res.status(400).json({
        status: "ERROR",
        message: "UserId khong hop le",
      });
    }
    const resUpdate = await UserAdminService.updateUser(userId, data);
    return res.status(200).json(resUpdate);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;

    if (!userId) {
      return res.status(400).json({
        status: "ERROR",
        message: "UserId khong hop le",
      });
    }
    const resDelete = await UserAdminService.deleteUser(userId, data);
    return res.status(200).json(resDelete);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { limit, page } = req.query;
    // sort
    const resGetAll = await UserAdminService.getAllUsers(
      Number(limit) || 5,
      Number(page) || 0
      // sort
    );
    return res.status(200).json(resGetAll);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getDetailsUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({
        status: "ERROR",
        message: "UserId khong hop le",
      });
    }

    const resDetails = await UserAdminService.getDetailsUser(userId);
    return res.status(200).json(resDetails);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = req.headers.token.split(" ")[1];

    if (!token) {
      return res.status(400).json({
        status: "ERROR",
        message: "Token khong hop le controller",
      });
    }
    const resRefresh = await JwtService.refreshTokenJwtService(token);
    return res.status(200).json(resRefresh);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getDetailsUser,
  refreshToken,
};
