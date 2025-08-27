const User = require("../model/user");
//import bcrypt which is used to hash password
const bcrypt = require("bcrypt");
//Import jsonwebtoken(jwt)
const jwt = require("jsonwebtoken");
//Load dotenv content into process
require("dotenv").config();

//Register controller
const registerUser = async (req, res) => {
  try {
    //Extract user info from req.body
    const { username, email, password, role } = req.body;
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    //If user with the given username and password exist
    if (existingUser) {
      console.log(
        "User with the given username or email address already exist."
      );
      return res.status(400).json({
        status: "Failed",
        message:
          "Username and email already exist. Please try to register with a different username and email address.",
      });
    }
    //Next, hash user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //Create new user account and save in database
    const userDataForm = { username, email, password: hashedPassword };
    if (role) {
      userDataForm.role = role;
    }
    const newUser = await User.create(userDataForm);
    console.log("New user account has been created");
    res.status(201).json({
      status: "Success",
      message: "New user account has been created successfully.",
    });
  } catch (error) {
    console.log("Error registering user.");
    res.status(500).json({
      status: "Failed",
      message: "Internal server error.",
    });
  }
};

//Login controller
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    //Check if user with given username exists
    const user = await User.findOne({ username });
    if (!user) {
      console.log("User with the given username does not exist.");
      return res.status(404).json({
        status: "Login Failed",
        message: "User with the given username does not exist.",
      });
    }

    //Now, check if the given password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.log("Incorrect password. Please enter correct password");
      return res.status(400).json({
        status: "Failed",
        message: "Incorrect password. Please enter correct password.",
      });
    }
    //Create bearer token which contains payload, jwt secret key and token expiry duration
    const accessToken = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15m" }
    );
    res.status(200).json({
      status: "Success",
      message: "Logged in succesfully",
      accessToken,
    });
  } catch (error) {
    console.log("Login error.");
    res.status(500).json({
      status: "Failed",
      message: "Internal server error",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.userInfo.userId;

    //Extract old and new password
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "Failed",
        message: "User with the given ID is not found",
      });
    }
    //Check if oldPassword is the same as password in database
    const passwordCheck = await bcrypt.compare(oldPassword, user.password);
    if (!passwordCheck) {
      return res.status(400).json({
        status: "Failed",
        message: "Incorrect password given. Password change request denied.",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = newHashedPassword;
    await user.save();

    res.status(200).json({
      status: "Success",
      message: "Successfully saved changes in record",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Failed",
      message: `Internal server error: ${error}`,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  changePassword,
};
