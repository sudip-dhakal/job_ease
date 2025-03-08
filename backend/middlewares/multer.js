// multer.js
const multer = require("multer");
const path = require("path");

// Memory storage for the profilePic and logo (to upload to cloudinary)
const memoryStorage = multer.memoryStorage();

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "resume") {
      cb(null, path.join(__dirname, "../uploads/resumes"));
    } else if (file.fieldname === "descriptionFile") {
      cb(null, path.join(__dirname, "../uploads/jobdesc"));
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const limits = { fileSize: 5 * 1024 * 1024 }; // 5MB limit for each file

const fileFilter = (req, file, cb) => {
  if (
    (file.fieldname === "resume" || file.fieldname === "descriptionFile") &&
      (
          file.mimetype === "application/pdf" ||
          file.mimetype === "text/plain"
      )
    )
     {
    cb(null, true);
  } else if (
    (file.fieldname === "profilePic" || file.fieldname === "logo") &&
    (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg")
  ){
        cb(null, true);
      }
   else {
    cb(new Error("Only PDF, TXT and JPEG, PNG, JPG files allowed"), false);
  }
};
// Custom Storage Engine
const customStorage = {
  _handleFile: (req, file, cb) => {
    if(file.fieldname === 'profilePic'){
        memoryStorage._handleFile(req, file, cb);
    }else if(file.fieldname === 'logo'){
      memoryStorage._handleFile(req, file, cb);
  }  else {
        diskStorage._handleFile(req, file, cb)
    }
  },
   _removeFile: function(req, file, cb) {
    if(file.fieldname === 'profilePic'){
        memoryStorage._removeFile(req, file, cb)
    }else if(file.fieldname === 'logo'){
      memoryStorage._removeFile(req, file, cb)
  }  else {
        diskStorage._removeFile(req, file, cb)
    }
  }
};

// Multer instance that uses memoryStorage for profilePic and diskStorage for other files

const multiFileUpload = multer({
    storage: customStorage,
     limits,
     fileFilter
}).fields([
    { name: "resume", maxCount: 1 },
    { name: "descriptionFile", maxCount: 1 },
     { name: "profilePic", maxCount: 1 },
     { name: "logo", maxCount: 1 },

  ]);

const descriptionFileUpload = multer({ storage: diskStorage, limits, fileFilter }).single("descriptionFile");


module.exports = { multiFileUpload, descriptionFileUpload };