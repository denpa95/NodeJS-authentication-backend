const multer = require("multer");
const path = require("path");

//Set multer storage
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "imageUploads/");
  },
  filename: function (req, file, callback) {
    callback(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

//File filter function
const checkFileFilter = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback(
      new Error("File type is not an image. Please upload only images.")
    );
  }
};

//Create multer middleware
module.exports = multer({
  storage: storage,
  fileFilter: checkFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, //5 MB file size limit
});
