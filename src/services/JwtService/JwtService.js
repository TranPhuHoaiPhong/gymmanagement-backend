const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const genneralAccessToken = (payload) => {
  const access_Token = jwt.sign(
    {
      payload,
    },
    process.env.ACCCESS_TOKEN,
    { expiresIn: "30s" }
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
      console.log("token", token);
      jwt.verify(token, process.env.REFRESH_TOKEN, (err, user) => {
        if (err) {
          console.log("err", err);
          resolve({
            status: "ERROR",
            message: "Token khong hop le service",
          });
        }
        console.log("user", user);
        const { payload } = user;
        const access_Token = genneralAccessToken({
          id: payload?.id,
          isAdmin: payload?.isAdmin,
        });
        console.log("access_Token", access_Token);
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
