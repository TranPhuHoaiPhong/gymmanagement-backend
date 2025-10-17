const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const authMiddleware = (req, res, next) => {
  const token = req.headers.token.split(" ")[1];
  jwt.verify(token, process.env.ACCCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(404).json({
        status: "ERROR",
        message: "Token khong hop le",
      });
    }
    const { payload } = user;
    if (payload.isAdmin) {
      next();
    } else {
      return res.status(404).json({
        status: "ERROR",
        message: "Ban khong co quyen truy cap Admin",
      });
    }
  });
};

module.exports = {
  authMiddleware,
};
