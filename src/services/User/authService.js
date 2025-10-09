const User = require("../../models/User/User");
const bcrypt = require("bcryptjs"); 

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
// Hàm login user
async function loginUserService({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) throw new Error("Invalid password");

    return user; // sau này có thể trả token JWT
}

module.exports = {
    registerUserService,
    loginUserService
};
