const UserAdminService = require("../../services/Admin/UserAdminService");

const createUser = async (req, res) => {
  try {
    console.log(req.body);
    const resCreate = await UserAdminService.createUser();
    return res.status(200).json(resCreate);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createUser,
};
