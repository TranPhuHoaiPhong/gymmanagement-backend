const express = require("express");
const router = express.Router();
const authController = require("../controllers/User/authController");

router.post("/register", authController.register);

module.exports = router;