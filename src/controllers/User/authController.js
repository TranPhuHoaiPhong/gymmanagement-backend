const { registerUserService, loginUserService } = require("../../services/User/authService");

exports.register = async (req, res) => {
  try {
    const newUser = await registerUserService(req.body);

    if (!newUser.success) {
      return res.status(400).json({ msg: newUser.message });
    }

    return res.status(200).json({ msg: newUser.message, data: newUser.data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const checkUser = await loginUserService(req.body);

    console.log("checkUser:", checkUser);

    if (!checkUser.success) {
      return res.status(400).json({ msg: checkUser.message }); 
    }

    return res.status(200).json({ msg: checkUser.message, data: checkUser.data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: err.message });
  }
};