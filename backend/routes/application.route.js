const express  = require('express');

const { updateStatus,    getApplicants, getAppliedJobs,applyJob,deleteApplication} = require("../controllers/application.controller");

const { isAuthenticated } = require('../middlewares/authenticate');
const {isAuthorized } = require('../middlewares/authorization');


const router = express.Router();

router.route("/apply/:id").post(isAuthenticated,isAuthorized(['user']),applyJob);
router.route("/get").get(isAuthenticated,isAuthorized(['user']), getAppliedJobs);
router.route("/:id/applicants").get(isAuthenticated,isAuthorized(['recruiter']), getApplicants);  

router.route("/status/:id/update").put(isAuthenticated,isAuthorized(['recruiter']),updateStatus);
router.route("/delete/:id").delete(isAuthenticated,deleteApplication);



module.exports= router;
