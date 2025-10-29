const { updateOrCreateHealthInfo } = require("../../services/User/healthInfo");


exports.addHealthInfo = async (req, res) => {
  try {
    console.log("Request Body:", req.body); 
    const userId = req.userId;
    console.log("User ID from token:", userId);
    const newUser = await updateOrCreateHealthInfo(req.body);

    if (!newUser.success) {
      return res.status(400).json({ msg: newUser.message });
    }

    return res.status(200).json({ msg: newUser.message, data: newUser.data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: err.message });
  }
};