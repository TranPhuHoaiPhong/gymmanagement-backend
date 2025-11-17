const multer = require("multer");
const path = require("path");

// Folder lưu ảnh
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../assets/images/avatar"));
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

// Chỉ nhận file ảnh
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const mime = allowedTypes.test(file.mimetype);

  if (mime) cb(null, true);
  else cb(new Error("File type not supported"), false);
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
