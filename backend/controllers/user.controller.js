const User = require("../models/user.model");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const getDataUri = require("../utilities/datauri");
const cloudinary = require("../utilities/cloudinary");
const mongoose = require("mongoose");
const ResumeData = require("../models/resume.model");

const register = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, role = "user" } = req.body;

    if (!fullName || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    // Check if user already exists

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exist with this email.",
        success: false,
      });
    }

    let profilePicUrl = "";
    if (req.files && req.files["profilePic"]) {
      const profilePicFile = req.files["profilePic"][0];
      const fileUri = getDataUri(profilePicFile);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      profilePicUrl = cloudResponse.secure_url; // Get the URL from Cloudinary response
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {
        profilePic: profilePicUrl || "No profile picture provided",
      },
    });

    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        error: "All fields are required",
        success: false,
      });
    }

    let user = await User.findOne({ email, role }).populate("resumeData"); // POPULATEEE

    if (!user) {
      return res.status(400).json({
        error: "User not found",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        error: "Invalid password",
        success: false,
      });
    }

    if (role !== user.role) {
      return res.status(400).json({
        error: "Invalid role for the user",
        success: false,
      });
    }

    //If the email, password, and role are correct, a JWT  is generated using the user's _id as part of the payload:

    const tokenData = {
      userId: user._id,
      role: user.role,
    };

    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    // creating simplified version of the user object to avoid sending sensitive information (like the password) back in the response:
    user = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
      resumeData: user.resumeData
        ? {
            // Conditionally include resumeData and resumeFilePath
            ...user.resumeData.toObject(),
            resumeFilePath: user.resumeData.resumeFilePath, // Access the resumeFilePath from the populated document
          }
        : null,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: "Logged in successfully",
        success: true,
        user: user,
      });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Logout failed" });
  }
};

const fs = require("fs");
const path = require("path");
const FormData = require("form-data"); // Ensure you're using the correct FormData package
const axios = require("axios");

const updateProfile = async (req, res) => {
  console.log("Update Profile route hit");
  try {
    const { fullName, email, phoneNumber, bio, skills } = req.body;
    const userId = req.id; // Middleware authentication

    console.log("req.files:", req.files);

    // if(email){
    //   const emailExists = await User.findOne({email});
    //   if(emailExists){
    //     return res.status(400).json({message: "Email already exists", success: false});
    //   }
    // }

    // Find the user
    let user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    // Update fields if provided
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skills.split(",");

    if (req.files && req.files["profilePic"]) {
      const profilePicFile = req.files["profilePic"][0];
      let profilePicUrl = "";
      try {
        const fileUri = getDataUri(profilePicFile);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        profilePicUrl = cloudResponse.secure_url;
        user.profile.profilePic = profilePicUrl;
      } catch (cloudinaryError) {
        console.error("Cloudinary upload error:", cloudinaryError);
        return res.status(500).json({
          message: "Error uploading profile picture.",
          success: false,
          error: cloudinaryError,
        });
      }
    }

    // Handle resume file upload (if provided)
    if (req.files && req.files["resume"]) {
      const resumeFile = req.files["resume"][0]; // Access the first resume file
      const fullResumePath = resumeFile.path; // Get the complete path from Multer

      // Read the file as a buffer
      const fileBuffer = fs.readFileSync(resumeFile.path);

      // Create a new FormData instance
      const formData = new FormData();
      formData.append("resume", fileBuffer, resumeFile.originalname);

      try {
        const response = await axios.post(
          "http://localhost:6466/uploadResume",
          formData,
          {
            headers: {
              ...formData.getHeaders(),
              "User-ID": userId, // Pass userId in headers
            },
            timeout: 1000000,
          }
        );

        if (response?.data?.success) {
          const entities = response.data.entities;
          console.log("Extracted Entities:", entities);
          const newResumeId = response.data.resume_id;

          // Update resume data and file path in user profile
          user.resumeData = new mongoose.Types.ObjectId(newResumeId);
          // Update resume data in user profile
          user.profile.resume = entities;
          user.resumeData = new mongoose.Types.ObjectId(newResumeId);
          const resumeData = await ResumeData.findById(newResumeId);
          if (resumeData) {
            resumeData.resumeFilePath = fullResumePath; // Store full path in ResumeData model
            await resumeData.save();
          }
        } else {
          throw new Error("Failed to process resume");
        }
      } catch (error) {
        console.error(
          "Error processing resume:",
          error.response?.data || error.message || error
        );
        return res.status(500).json({
          message: "An error occurred while processing the resume.",
          success: false,
          error: error.response?.data || error.message,
        });
      }
    }

    console.log("Before Save - user data:", user);
    await user.save();
    return res
      .status(200)
      .json({ message: "Profile updated successfully", user, success: true });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

module.exports = {
  register,
  updateProfile,
  login,
  logout,
};
