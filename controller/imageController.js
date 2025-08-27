//Controller for image upload
const Image = require("../model/image");
const { uploadToCloudinary } = require("../utils/cloudinaryHelper");
const fs = require("fs");
const cloudinary = require("../config/cloudinary");
const deleteDebug = require("debug")("deleteImage");

const uploadImage = async (req, res) => {
  try {
    //Check if file or filepath is missing from req object
    if (!req.file) {
      console.log(
        "Error! File object or filepath is not found in request object! Please provide one."
      );
      return res.status(400).json({
        status: "Failed",
        message:
          "File object is not found in request object. Please provide a file object or filepath.",
      });
    }
    //If file object of filepath is given, proceed to upload to cloudinary
    const result = await uploadToCloudinary(req.file.path);
    //Once file is uploaded into cloudinary, store image record into database
    const image = new Image({
      url: result.url,
      publicID: result.publicID,
      uploadedBy: req.userInfo.userId,
    });

    await image.save();

    //Delete file from local storage after uploading into Cloudinary and creating record
    //fs.unlinkSync(req.file.path);

    res.status(201).json({
      status: "Success",
      message: "New image record created successfully in database",
      image,
    });
  } catch (error) {
    console.log(`Error uploading image record into database: ${error}.`);
    res.status(500).json({
      status: "Failed",
      message: "Internal server error",
    });
  }
};

const fetchImages = async (req, res) => {
  try {
    // Page number
    const page = parseInt(req.query.page) || 1;
    // Number of images per page
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    // countDocuments() returns total no. of records in collection
    const totalImages = await Image.countDocuments();
    const totalPages = Math.ceil(totalImages / limit);
    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    const images = await Image.find().sort(sortObj).skip(skip).limit(limit);
    if (!images) {
      return res.status(404).json({
        status: "Failed",
        message: "No images found in database. Please upload an image.",
      });
    }
    res.status(200).json({
      status: "Success",
      message: "Image fetched from database successfully.",
      currentPage: page, 
      totalPages: totalPages,
      totalImages: totalImages,
      images,
    });
  } catch (error) {
    console.log(`Error fetching image: ${error}`);
    res.status(500).json({
      status: "Failed",
      message: "Internal server error",
    });
  }
};

const deleteImage = async (req, res) => {
  try {
    const getImageToBeDeletedID = req.params.id;
    deleteDebug(`ID of image to be deleted: ${getImageToBeDeletedID}`);
    const userId = req.userInfo.userId;
    deleteDebug(`user ID: ${userId}`);
    const image = await Image.findById(getImageToBeDeletedID);
    deleteDebug(`Image to be deleted: ${image}`);
    if (!image) {
      return res.status(404).json({
        status: "Failed",
        message: "Image with the given ID is not found!",
      });
    }
    //Check if image is uploaded by current logged in user
    if (image.uploadedBy.toString() !== userId) {
      return res.status(403).json({
        status: "Success",
        message: "User is not authorized to delete the image.",
      });
    }
    //Delete this image from Cloudinary first
    await cloudinary.uploader.destroy(image.publicID);

    //Delete image record from MongoDB database
    await Image.findByIdAndDelete(getImageToBeDeletedID);

    res.status(200).json({
      status: "Success",
      message: "Image successfully deleted from record",
    });
  } catch (error) {
    return res.status(500).json({
      status: "Failed",
      message: `Internal server error: ${error}`,
    });
  }
};

module.exports = { uploadImage, fetchImages, deleteImage };
