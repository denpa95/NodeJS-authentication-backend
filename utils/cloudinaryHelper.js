//Cloudinary helper file
const cloudinary = require("../config/cloudinary");

//Function used to upload file to cloudinary
const uploadToCloudinary = async (filePath) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(filePath);
    //Return an object containing URL and public ID of uploaded image
    return {
      url: uploadResult.secure_url,
      publicID: uploadResult.public_id,
    };
  } catch (error) {
    console.log(`Error while uploading to cloudinary: ${error}.`);
    throw new Error("Error uploading file to cloudinary.");
  }
};

module.exports = { uploadToCloudinary };
