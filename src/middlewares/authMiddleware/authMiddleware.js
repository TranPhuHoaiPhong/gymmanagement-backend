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

const authUserMiddleware = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const userId = req.params.id;
  jwt.verify(token, process.env.ACCCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(404).json({
        status: "ERROR",
        message: "Token khong hop le",
      });
    }
    const { payload } = user;
    if (payload?.isAdmin || payload?._id == userId) {
      next();
    } else {
      return res.status(404).json({
        status: "ERROR",
        message: "Ban khong co quyen truy cap Admin",
      });
    }
  });
};

const authUserApp = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      status: "ERROR",
      message: "Token missing",
    });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCCESS_TOKEN, function (err, decoded) {
    if (err) {
      return res.status(404).json({
        status: "ERROR",
        message: "Token khong hop le",
      });
    }


    const { payload } = decoded;

    req.userId = payload.id;
    req.isAdmin = payload.isAdmin || false;

    next();
  });
};



module.exports = {
  authMiddleware,
  authUserMiddleware,
  authUserApp,
};
