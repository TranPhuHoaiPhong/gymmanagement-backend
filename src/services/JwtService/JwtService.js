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

module.exports = {
  genneralAccessToken,
  genneralRefreshToken,
};
