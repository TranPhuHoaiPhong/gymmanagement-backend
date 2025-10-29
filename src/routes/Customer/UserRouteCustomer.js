const express = require("express");
const router = express.Router();
const authController = require("../../controllers/User/authController");
const healthInfo = require("../../controllers/User/healthInfo");
const { authUserApp } = require("../../middlewares/authMiddleware/authMiddleware");


router.post("/sign-in", authController.login);
router.post("/sign-up", authController.register); 

router.post("/health-info",authUserApp , healthInfo.addHealthInfo); 



module.exports = router;