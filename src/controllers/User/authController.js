const { registerUserService } = require("../../services/User/authService");

exports.register = async (req, res) => {
     try {
        const newUser = await registerUserService(req.body);
        res.status(201).json({ msg: "User registered successfully", userId: newUser._id });
    } catch (err) {
        console.error(err);
        res.status(400).json({ msg: err.message });
    }
}
