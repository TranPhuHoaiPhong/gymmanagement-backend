const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const genneralAccessToken = (payload) => {
  const access_Token = jwt.sign(
    {
      payload,
    },
    process.env.ACCCESS_TOKEN,
    { expiresIn: "1d" }
    // chinh lai 30s sau nay
  );

  return access_Token;
};

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

const refreshTokenJwtService = async (token) => {
  return new Promise(async (resolve, reject) => {
    try {
      jwt.verify(token, process.env.REFRESH_TOKEN, (err, user) => {
        if (err) {
          console.log("err", err);
          resolve({
            status: "ERROR",
            message: "Token khong hop le service",
          });
        }
        const { payload } = user;
        const access_Token = genneralAccessToken({
          id: payload?.id,
          isAdmin: payload?.isAdmin,
        });
        resolve({
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
