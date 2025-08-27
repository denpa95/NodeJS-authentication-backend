const express = require("express");
const {
  registerUser,
  loginUser,
  changePassword,
} = require("../controller/authController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

//All routes are related to user authentication
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/change-password", authMiddleware, changePassword);

module.exports = router;
