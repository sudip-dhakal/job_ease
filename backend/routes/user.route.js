const express = require('express');
const { login, register, updateProfile, logout } = require("../controllers/user.controller");
const { isAuthenticated } = require('../middlewares/authenticate');
const {  multiFileUpload } = require("../middlewares/multer");


const router = express.Router();

// Registration route with single file upload for profilePic
router.route("/register").post(multiFileUpload, register);

// Login route
router.route("/login").post(login);

// Profile update route with multiUpload for both profilePic (Cloudinary) and resume (local)
router.route("/profile/update").patch(isAuthenticated, multiFileUpload, updateProfile);
// Logout route
router.route("/logout").get(logout);

module.exports = router;
