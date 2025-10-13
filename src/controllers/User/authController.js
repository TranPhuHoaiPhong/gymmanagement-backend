const { registerUserService } = require("../../services/User/authService");

exports.register = async (req, res) => {
  try {
    const newUser = await registerUserService(req.body);

    if (!newUser.success) {
      return res.status(400).json({ msg: newUser.message }); // Dừng ở đây
    }

    return res.status(200).json({ msg: newUser.message, data: newUser.data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: err.message });
  }
};
