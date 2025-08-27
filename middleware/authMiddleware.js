const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader && authHeader.split(" ")[1];
  if (!bearerToken) {
    return res.status(401).json({
      status: "Failed",
      message: "Access denied! No token provided. Please login to continue.",
    });
  }
  //If token is provided, decrypt the token
  try {
    const decodedToken = jwt.verify(bearerToken, process.env.JWT_SECRET_KEY);
    console.log(decodedToken);
    req.userInfo = decodedToken;
    next();
  } catch (error) {
    console.log(`Error decoding token: ${error}.`);
    return res.status(500).json({
      status: "Failed",
      message: `Internal server error: ${error}`,
    });
  }
};

module.exports = authMiddleware;
