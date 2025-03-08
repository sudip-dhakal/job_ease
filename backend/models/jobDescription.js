// models/jobDescription.js
const mongoose = require('mongoose');

const jobDescriptionSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },  // Reference to the Job model
  descriptionText: { type: String, required: false },
  descriptionFile: { type: String },  // File path of the uploaded PDF
  parsedEntities: { type: Map, of: [String] },  // A map of entity types to extracted values
}, { timestamps: true });

module.exports = mongoose.model('JobDescription', jobDescriptionSchema);
