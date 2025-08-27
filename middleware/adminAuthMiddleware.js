const adminAuthMiddleware = (req, res, next) => {
  if (req.userInfo.role !== "admin") {
    return res.status(401).json({
      status: "Failed",
      message: "Access denied! User is not an admin.",
    });
  }
  next();
};

module.exports = adminAuthMiddleware;
