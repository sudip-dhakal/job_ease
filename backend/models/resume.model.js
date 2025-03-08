// models/resumeData.model.js
const mongoose = require('mongoose');

const resumeDataSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true }, // Changed to 'user'
    Name: { type: String, required: false },
    LinkedIn: { type: String, required: false },
    Skills: { type: [String], required: false }, // Make sure it's an array of strings
Certification: { type: [String], required: false },    WorkedAs: { type: String, required: false },
    Experience: { type: String, required: false },
    resumeFilePath: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
  });
  
  const ResumeData = mongoose.model('ResumeData', resumeDataSchema);
  module.exports = ResumeData; // Correct export