const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.log(`Error connecting to database: ${error}`);
    process.exit(1);
  }
};

module.exports = connectToDB;
