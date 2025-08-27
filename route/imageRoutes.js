const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");
const {
  uploadImage,
  fetchImages,
  deleteImage,
} = require("../controller/imageController");
const multerMiddleware = require("../middleware/uploadMiddleware");

router.post(
  "/upload",
  authMiddleware,
  adminAuthMiddleware,
  multerMiddleware.single("image"),
  uploadImage
);

router.get("/get", authMiddleware, fetchImages);

router.delete("/delete/:id", authMiddleware, adminAuthMiddleware, deleteImage);

module.exports = router;
