const { updateOrCreateHealthInfo, getHealthInfo, updateHealthInfo } = require("../../services/User/healthInfo");


exports.addHealthInfo = async (req, res) => {
  try {
    const userId = req.userId;
    const newUser = await updateOrCreateHealthInfo(userId, req.body);

    if (!newUser.success) {
      return res.status(400).json({ msg: newUser.message });
    }

    return res.status(200).json({ msg: newUser.message, data: newUser.data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: err.message });
  }
};

exports.updateHealthInfo = async (req, res) => {
  try {
    const userId = req.userId;
    const newUser = await updateHealthInfo(userId, req.body);

    if (!newUser.success) {
      return res.status(400).json({ msg: newUser.message });
    }

    return res.status(200).json({ msg: newUser.message, data: newUser.data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: err.message });
  }
};

exports.getHealthInfo = async (req, res) => {
  try {
    const userId = req.userId;
    const newUser = await getHealthInfo(userId);

    if (!newUser.success) {
      return res.status(400).json({ msg: newUser.message });
    }

    return res.status(200).json({ msg: newUser.message, data: newUser.data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: err.message });
  }
};