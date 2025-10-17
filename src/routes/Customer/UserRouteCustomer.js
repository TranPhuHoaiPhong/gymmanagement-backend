const express = require("express");
const router = express.Router();
const authController = require("../../controllers/User/authController");

router.post("/sign-in", authController.login);
router.post("/sign-up", authController.register);

module.exports = router;