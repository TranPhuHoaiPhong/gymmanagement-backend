const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// Sinh access token (thời hạn ngắn)
const genneralAccessToken = (payload) => {
  const access_Token = jwt.sign(
    {
      payload, // payload chứa id, role
    },
    process.env.ACCCESS_TOKEN,
    { expiresIn: "1d" } // bạn có thể chỉnh lại 30s sau này
  );
  return access_Token;
};

// Sinh refresh token (thời hạn dài)
const genneralRefreshToken = (payload) => {
  const refresh_Token = jwt.sign(
    {
      payload,
    },
    process.env.REFRESH_TOKEN,
    { expiresIn: "365d" }
  );
  return refresh_Token;
};

// Hàm làm mới access token
const refreshTokenJwtService = async (token) => {
  return new Promise(async (resolve, reject) => {
    try {
      jwt.verify(token, process.env.REFRESH_TOKEN, (err, user) => {
        if (err) {
          console.log("Lỗi verify refresh token:", err);
          return resolve({
            status: "ERROR",
            message: "Token khong hop le service",
          });
        }

        const { payload } = user;

        // Sinh lại access token mới dựa trên id và role trong payload
        const access_Token = genneralAccessToken({
          id: payload?.id,
          role: payload?.role,
        });

        return resolve({
          status: "OK",
          message: "Lấy token thành công",
          access_Token,
        });
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  genneralAccessToken,
  genneralRefreshToken,
  refreshTokenJwtService,
};
