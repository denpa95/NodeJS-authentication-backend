const mongoose = require("mongoose");
const { Schema } = mongoose;

const ImageSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    publicID: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", //User model
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Image", ImageSchema);
