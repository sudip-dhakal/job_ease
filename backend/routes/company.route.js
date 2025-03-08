const express  = require('express');
const {getCompany,getCompanyById, registerCompany, updateCompany,deleteCompany } = require("../controllers/company.controller");
const { isAuthenticated } = require('../middlewares/authenticate');
const { multiFileUpload }  = require("../middlewares/multer")

const {isAuthorized } = require('../middlewares/authorization');

const router = express.Router();

router.route("/register").post(isAuthenticated, isAuthorized(['recruiter']),multiFileUpload,registerCompany);
router.route("/get").get(isAuthenticated, getCompany);
router.route("/get/:id").get(isAuthenticated, getCompanyById);  

router.route("/update/:id").put(isAuthenticated,isAuthorized(['recruiter']),multiFileUpload,updateCompany);

router.route("/delete/:id").delete(isAuthenticated,isAuthorized(['recruiter']),deleteCompany);



module.exports= router;
