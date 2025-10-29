const User = require("../../models/User/User");
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken");
const { genneralAccessToken, genneralRefreshToken } = require("../JwtService/JwtService");

async function registerUserService({ fullName, email, password, phone, gender, dateOfBirth }) {
    try {
    if (!fullName || !email || !password || !phone || !gender || !dateOfBirth) {
      return {
        success: false,
        message: "Vui lòng điền đầy đủ thông tin",
      };
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return {
        success: false,
        message: "Email đã tồn tại",
      };
    }

    const existingPHone = await User.findOne({ phone });
    if (existingPHone) {
      return {
        success: false,
        message: "Số điện thoại đã tồn tại",
      };
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Tạo user mới
    const newUser = new User({
      fullName,
      email,
      phone,
      gender,
      dateOfBirth,
      passwordHash,
    });

    await newUser.save();

    return {
      success: true,
      message: "Đăng ký thành công",
      data: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
      },
    };
  } catch (err) {
    console.error("Error in registerUserService:", err);
    return {
      success: false,
      message: "Đăng ký thất bại: " + err.message,
    };
  }
}

async function loginUserService({ email, password }) {
    if (!email || !password) {
      return {
        success: false,
        message: "Vui lòng điền đầy đủ thông tin",
      };
    }

    const user = await User.findOne({ email });

    if (!user) {
      return {
        success: false,
        message: "Tài khoản không tồn tại!",
      }
    }

    if (user.isActive === false) {
      return {
        success: false,
        message: "Tài khoản đã bị vô hiệu hóa!",
      }
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return {
        success: false,
        message: "Mật khẩu không đúng!",
      };
    }

    const payload = { 
                      id: user._id, 
                      role: user.role, 
                      email: user.email, 
                      fullName: user.fullName, 
                      gender: user.gender, 
                      healthInfo: user.healthInfo,
                      membership: user.membership
                    };
    const accessToken = genneralAccessToken(payload);
    const refreshToken = genneralRefreshToken(payload);

    return {
      success: true,
      message: "Đăng nhập thành công",
      tokens: {
        accessToken,
        refreshToken,
      },
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        healthInfo: user.healthInfo
      },
    };
}

module.exports = {
    registerUserService,
    loginUserService
};
