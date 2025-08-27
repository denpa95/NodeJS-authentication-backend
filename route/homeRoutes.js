const express = require("express");
const router = express.Router();
//Import authentication middleware
const authMiddleware = require("../middleware/authMiddleware");

router.get("/welcome", authMiddleware, (req, res) => {
  const { userId, username, role } = req.userInfo;
  return res.status(200).json({
    user: {
      _id: userId,
      username,
      role,
    },
  });
});

module.exports = router;
