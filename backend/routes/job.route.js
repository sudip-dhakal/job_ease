const express  = require('express');
const { postJob,    getAllJobs ,    getJobById,     getAdminJobs,updateJob,deleteJob } = require("../controllers/job.controller");
const { isAuthenticated } = require('../middlewares/authenticate');
const {isAuthorized } = require('../middlewares/authorization');

const { singleUpload, multiFileUpload,descriptionFileUpload } = require("../middlewares/multer");

const router = express.Router();

router.route("/post").post(isAuthenticated, isAuthorized(['recruiter']), multiFileUpload, postJob);

// Route to get all jobs, accessible by everyone
router.route("/get").get(isAuthenticated, getAllJobs);

// Route to get jobs posted by recruiters (admin view), only accessible by recruiters
router.route("/getadminjobs").get(isAuthenticated, isAuthorized(['recruiter']), getAdminJobs);

// Route to get a specific job, accessible by everyone
router.route("/get/:id").get(isAuthenticated, getJobById);

router.route("/update/:id").patch(isAuthenticated, isAuthorized(['recruiter']), multiFileUpload, updateJob);

router.route("/delete/:id").delete(isAuthenticated, isAuthorized(['recruiter']), deleteJob);

module.exports= router;
