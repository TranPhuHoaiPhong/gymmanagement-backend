const express = require("express");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const connectDB = require("./src/config/db");
const routes = require("./src/routes/index");
const multer = require("multer");
const path = require("path");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());

connectDB();

app.use("/api", routes);
app.use(
  "/images/avatar",
  express.static(path.join(__dirname, "src/assets/images/avatar"))
);

// Nếu muốn expose thêm folder images khác
app.use("/images", express.static(path.join(__dirname, "src/assets/images")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
