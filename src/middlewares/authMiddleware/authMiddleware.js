const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

/**
 * Middleware xác thực token JWT
 * Dùng cho tất cả loại tài khoản (admin, staff, trainer, member)
 */
const authenticate = (req, res, next) => {
  try {
    const token = req.headers.token?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        status: "ERROR",
        message: "Token không tồn tại",
      });
    }

    jwt.verify(token, process.env.ACCCESS_TOKEN, function (err, decoded) {
      if (err) {
        return res.status(403).json({
          status: "ERROR",
          message: "Token không hợp lệ",
        });
      }

      req.user = decoded.payload; // lưu user vào request để các middleware khác dùng
      next();
    });
  } catch (error) {
    return res.status(500).json({
      status: "ERROR",
      message: "Lỗi xác thực người dùng",
    });
  }
};

/**
 * Middleware kiểm tra quyền truy cập
 * @param  {...string} allowedRoles - danh sách quyền được phép (vd: "admin", "staff")
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    if (!userRole) {
      return res.status(403).json({
        status: "ERROR",
        message: "Không xác định được quyền người dùng",
      });
    }

    if (allowedRoles.includes(userRole)) {
      next();
    } else {
      return res.status(403).json({
        status: "ERROR",
        message: `Tài khoản của bạn (${userRole}) không có quyền truy cập tài nguyên này`,
      });
    }
  };
};

/**
 * Middleware dành cho admin (hoặc quyền cao hơn)
 * Chỉ cho phép truy cập nếu role là "admin"
 */
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.token?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        status: "ERROR",
        message: "Token không tồn tại",
      });
    }

    jwt.verify(token, process.env.ACCCESS_TOKEN, function (err, decoded) {
      if (err) {
        return res.status(403).json({
          status: "ERROR",
          message: "Token không hợp lệ",
        });
      }

      const { payload } = decoded;

      if (payload.role === "admin") {
        req.user = payload; // lưu thông tin user vào req để các middleware sau dùng
        next();
      } else {
        return res.status(403).json({
          status: "ERROR",
          message: "Bạn không có quyền truy cập (chỉ dành cho Admin)",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: "ERROR",
      message: "Lỗi xác thực",
    });
  }
};

/**
 * Middleware cho phép Admin hoặc chính user đó truy cập
 */
const authUserMiddleware = (req, res, next) => {
  try {
    const token = req.headers.token?.split(" ")[1];
    const userId = req.params.id;

    if (!token) {
      return res.status(401).json({
        status: "ERROR",
        message: "Token không tồn tại",
      });
    }

    jwt.verify(token, process.env.ACCCESS_TOKEN, function (err, decoded) {
      if (err) {
        return res.status(403).json({
          status: "ERROR",
          message: "Token không hợp lệ",
        });
      }

      const { payload } = decoded;

      if (payload.role === "admin" || payload._id == userId) {
        req.user = payload;
        next();
      } else {
        return res.status(403).json({
          status: "ERROR",
          message: "Bạn không có quyền truy cập tài khoản này",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: "ERROR",
      message: "Lỗi xác thực người dùng",
    });
  }
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
  authenticate, // xác thực chung
  authorizeRoles, // kiểm tra quyền động
  authMiddleware, // chỉ cho admin
  authUserMiddleware, // cho admin hoặc chính user
  authUserApp, // xác thực cho app (member)

};
