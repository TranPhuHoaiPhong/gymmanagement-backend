const User = require("../../models/User/user");
const bcrypt = require("bcryptjs"); // hash password

// Hàm đăng ký user
async function registerUserService({ fullName, email, password, phone, gender, dateOfBirth }) {
    // Check user exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error("User already exists");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
        fullName,
        email,
        phone,
        gender,
        dateOfBirth,
        passwordHash
    });

    await newUser.save();
    return newUser;
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
