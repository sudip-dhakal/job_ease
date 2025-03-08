
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const { Job } = require("../models/job.model");
const Company = require("../models/company.model");
const User = require("../models/user.model");
const {Application} = require("../models/application.model");
// Post a new job with file upload
const JobDescription = require('../models/jobDescription');  // Import the model

const postJob = async (req, res) => {
  try {



    const {
      title,
      description,
      companyId,
      location,
      requirements,
      salary,
      position,
      jobType,
      experience,
    } = req.body;
    const userId = req.id;
    console.log("userid", userId);

    if (!title || !companyId || !location || !requirements || !jobType || !experience || !salary || !position) {
      return res.status(400).json({ error: "All fields are required", success: false });
    }

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ error: "Company not found", success: false });
    }
    if (company.userId.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized: You do not own this company", success: false });
    }

    let descriptionFile = null;
    let parsedEntities = null;
    let descriptionText = null;

    if (req.files && req.files.descriptionFile && req.files.descriptionFile[0]) {
      // Access the first file uploaded with the name descriptionFile
      const file = req.files.descriptionFile[0]
      descriptionFile = file.path;

      const fileBuffer = fs.readFileSync(file.path);
      const formData = new FormData();
      formData.append("jobDescription", fileBuffer, file.originalname);

      try {
        const response = await axios.post(
          "http://localhost:6466/uploadJobDescription",
          formData,
          { headers: { ...formData.getHeaders() }, timeout: 1000000, }
        );

        if (response.data.success) {
          parsedEntities = response.data.entities;
          descriptionText = response.data.descriptionText;
          descriptionFile = response.data.descriptionFile;
        } else {
          throw new Error("Failed to process job description");
        }
      } catch (error) {
        console.error("Error processing job description:", error);
        return res.status(500).json({ error: "Failed to process the job description file", success: false });
      }
    }
    var job;

    const requirementsArray = requirements.split(",").map(skill => skill.trim());
try{
     job = await Job.create({
      title,
      description,
      descriptionFile,
      parsedEntities,
      requirements: requirementsArray.join(", "),
      salary: Number(salary),
      location,
      position,
      company: companyId,
      created_by: userId,
      jobType,
      experienceLevel: experience,
    });
  }catch(error){
    console.error(error);
    return res.status(500).json({ error: error.message || "Server error, please try again later", success: false });  // Send the error message
  }
    const jobDescription = await JobDescription.create({
      jobId: job._id,
      descriptionText, // Full text of the job description
      descriptionFile,  // Path to the uploaded PDF file
      parsedEntities,  // Parsed entities
    });

    return res.status(201).json({ message: "Job posted successfully", success: true, job });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error, please try again later", success: false });
  }
};






// Get all jobs, optionally with keyword filtering
const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";

    // Search query for keyword matching in multiple fields
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { location: { $regex: keyword, $options: "i" } },
        // { position: { $regex: keyword, $options: "i" } },
      ],
    };

    // Fetch matching jobs from the database
    const jobs = await Job.find(query)
      .populate({
        path: "company",
      })
      .sort({ createdAt: -1 });

    if (!jobs.length) {
      return res.status(404).json({
        error: "No jobs found",
        success: false,
      });
    }

    // Send response with jobs
    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Server error, please try again later",
      success: false,
    });
  }
};

// Get a specific job by ID
const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    // Find the job by ID
    const job = await Job.findById(jobId);
    console.log("JOb with the id:",job);

    if (!job) {
      return res.status(404).json({
        error: "No job found",
        success: false,
      });
    }

    // Send response with job details
    return res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Server error, please try again later",
      success: false,
    });
  }
};

// Get jobs posted by an admin
const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;


    // Find jobs created by the admin
    const jobs = await Job.find({ created_by: adminId });

    if (!jobs.length) {
      return res.status(404).json({
        error: "No jobs found",
        success: false,
      });
    }

    // Send response with admin's jobs
    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Server error, please try again later",
      success: false,
    });
  }
};

const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.id;
    const { title, description, location, companyId,
      requirements, salary, position, jobType, experience } = req.body;


    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found", success: false });
    }

    const company = await Company.findById(job.company);
    if (!company) {
      return res.status(404).json({ error: "Company not found", success: false });
    }

    //authroization check to esnure user owns the company
    if (company.userId.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized: You do not own this company", success: false });
    }

    let descriptionFile = job.descriptionFile; // Keep the existing file path by default
    let parsedEntities = job.parsedEntities;
    let descriptionText = job.description;
    if (req.files && req.files.descriptionFile && req.files.descriptionFile[0]) {
      const file = req.files.descriptionFile[0];
      descriptionFile = file.path;

      const fileBuffer = fs.readFileSync(file.path);
      const formData = new FormData();
      formData.append("jobDescription", fileBuffer, file.originalname);

      try {
        const response = await axios.post(
          "http://localhost:6466/uploadJobDescription",
          formData,
          { headers: { ...formData.getHeaders() }, timeout: 1000000 }
        );

        if (response.data.success) {
          parsedEntities = response.data.entities;
          descriptionText = response.data.descriptionText;
          descriptionFile = response.data.descriptionFile;
        } else {
          throw new Error("Failed to process job description");
        }
      } catch (error) {
        console.error("Error processing job description:", error);
        return res.status(500).json({ error: "Failed to process the job description file", success: false });
      }
    }

    // Partial updates: Only update fields if they are provided in the request body
    if (title) job.title = title;
    if (description) job.description = description;
    if (descriptionFile) job.descriptionFile = descriptionFile; // Update if a new file was uploaded
    if (parsedEntities) job.parsedEntities = parsedEntities;       // Update if entities changed
    if (requirements) {
      const requirementsArray = requirements.split(",").map(skill => skill.trim());
      job.requirements = requirementsArray.join(", ");
    }
    if (salary) job.salary = Number(salary);
    if (location) job.location = location;
    if (position) job.position = position;
    if (jobType) job.jobType = jobType;
    if (experience) job.experienceLevel = experience;


    // Update JobDescription only if necessary
    if (descriptionText !== job.description || descriptionFile !== job.descriptionFile || (parsedEntities && JSON.stringify(parsedEntities) !== JSON.stringify(job.parsedEntities))) {
      const jobDescription = await JobDescription.findOne({ jobId: job._id });
      if (jobDescription) {
        jobDescription.descriptionText = descriptionText;
        jobDescription.descriptionFile = descriptionFile;
        jobDescription.parsedEntities = parsedEntities;
        await jobDescription.save();
      }
    }

    await job.save();

    return res.status(200).json({ message: "Job updated successfully", success: true, job });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error, please try again later", success: false });
  }
}

const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found", success: false });
    }

    // Find the company associated with the job
    const company = await Company.findById(job.company);
    if (!company) {
      return res.status(404).json({ error: "Company not found", success: false });
    }

    // Authorization: Check if the user owns the company
    if (company.userId.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized: You do not own this company", success: false });
    }

    await Application.deleteMany({ job: jobId }); 
    // Optionally, delete associated JobDescription
    await JobDescription.deleteOne({ jobId: job._id });


    // Delete the job
    await job.deleteOne();

    return res.status(200).json({ message: "Job deleted successfully", success: true });
  } catch (error) {
    console.error("Error deleting job:", error);
    return res.status(500).json({ error: "Server error, please try again later", success: false });



  }
}
// Exporting the controller functions
module.exports = {
  postJob,
  getAllJobs,
  getJobById,
  getAdminJobs,
  updateJob,
  deleteJob
};
