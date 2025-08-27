const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

router.get("/welcome", authMiddleware, adminAuthMiddleware, (req, res) => {
  const adminName = req.userInfo.username;
  res.status(200).send(`Welcome to Admin page, ${adminName}.`);
});

module.exports = router;
