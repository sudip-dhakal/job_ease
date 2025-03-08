const { Application } = require("../models/application.model");
const { Job } = require("../models/job.model");
const  User  = require("../models/user.model.js");
const axios = require('axios');
const JobDescription = require("../models/jobDescription.js");
const mongoose = require('mongoose'); 
const ObjectId = mongoose.Types.ObjectId; 
const ResumeData = require("../models/resume.model.js");

 const applyJob = async (req, res) => {
    try {
      console.log("req.id", req.id); //log req.id
      const jobId = req.params.id;
      const userId = req.id;

    //   console.log(`[applyJob] Starting with userId: ${userId}, jobId: ${jobId}`);

    const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
    if (existingApplication) {
        console.log(`[applyJob] User has already applied for jobId: ${jobId}`);
        return res.status(400).json({
            message: "You have already applied for this job",
            success: false,
        });
    }


      const user = await User.findById(userId).populate('resumeData');
      console.log(`[applyJob] User after populate:`, user); 

      if (!user) {
           console.log(`[applyJob] User not found for userId: ${userId}`);
          return res.status(404).json({ message: "User not found", success: false });
      }

      // Access the actual resumeData document from the populated field
      const resumeData = user.resumeData;


      if (!resumeData) {
          console.log(`[applyJob] resumeData is null. user object:`, user);
          return res.status(404).json({ message: "Resume data not found", success: false });
      }

      console.log(`[applyJob] resumeData object:`, resumeData); // Inspect the resumeData object


      mongoose.set('debug', true); // Add this before any Mongoose operations

      // Fetch job description data
      const jobDesc = await JobDescription.findOne({ jobId: new ObjectId(jobId) });
      if (!jobDesc) {
           console.log(`[applyJob] Job description not found for jobId: ${jobId}`);
          return res.status(404).json({ message: "Job description not found", success: false });
      }
      console.log(`[applyJob] jobDesc object:`, jobDesc); // Inspect the jobDesc object


      const flaskResponse = await axios.post('http://localhost:6466/match', {
          job_desc: jobDesc, // Send job description data
          resume_data: resumeData, // Send resume data
      });
      console.log(`[applyJob] Received response from Flask:`, flaskResponse.data);

      if (flaskResponse.data.error) {
           console.log(`[applyJob] Error in matching`);
          return res.status(500).json({ message: "Error in matching", success: false });
      }

      const matchScore = flaskResponse.data.match_score;
      console.log(`[applyJob] match score:`, matchScore);
      // Create a new application entry with the match score
      const newApplication = new Application({
          job: jobId,
          applicant: userId,
          matchingScore: matchScore,
      });
      console.log(`[applyJob] Created new application`);
      await newApplication.save();


      console.log(`[applyJob] saved the application`);
      await Job.findByIdAndUpdate(jobId, { $push: { applications: newApplication._id } });
console.log(`[applyJob] Application added to job applications list`);
      return res.status(200).json({
          message: "Application successful",
        //   matchingScore: matchScore,
          success: true,
      });
      } catch (error) {
      console.error(`[applyJob] Error:`, error);
      return res.status(500).json({ message: "Internal server error", success: false });
      }
  };



const getAppliedJobs = async(req,res)=>{
    try{
        const userId = req.id;
        const applications = await Application.find({applicant: userId}).sort({createdAt: -1}).populate({
            path:"job",
            options:{sort:{createdAt: -1}},
            populate:{path:"company",            options:{sort:{createdAt: -1}},
        },
        });
        if(!applications)
            {
                return res.status(404).json({
                    error: "No applications found",
                    success:false
                })
            }

            return res.status(200).json({
                success:true,
                message:"Applied Jobs fetched successfully",
                applications
            });



    }
    catch(error){
        console.error(error);
        res.status(500).json({error: "Failed to get applied jobs"});
    }
}

// for the admin to see the Applicants of the job he posted
    const getApplicants = async (req, res) => {
        try {
            const jobId = req.params.id;
            const job = await Job.findById(jobId)
                .populate({
                    path: 'applications',
                    populate: {
                        path: 'applicant',
                        populate: {
                            path: 'resumeData',
                            select: 'entities resumeFilePath' // Select relevant fields
                        },
                        select: 'fullName email _id profile' // Include profile for additional user data
                    }
                })
                .sort({ "applications.matchingScore": -1 });

            if (!job) {
                return res.status(404).json({ error: "Job not found", success: false });
            }

            const formattedApplicants = job.applications.map(application => {
                const applicant = application.applicant;
                const resumeData = applicant.resumeData || {}; // Handle null resumeData gracefully

                return {
                    applicationId: application._id,
                    applicant: {
                        _id: applicant._id,
                        fullName: applicant.fullName,
                        email: applicant.email,
                        profile: applicant.profile || {}, // Handle potential null profile
                        resume: {
                            filePath: resumeData.resumeFilePath || '', // Handle null filePath

                            
                        }
                    },
                    matchingScore: application.matchingScore,
                    status: application.status // Include application status
                };
            });
            return res.status(200).json({
                applicants: formattedApplicants,
                success: true,
                message: "Applicants fetched successfully",
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to get applicants of the job" });
        }
    };

const updateStatus = async (req,res)=>{
    try{
        const {status} = req.body;
        const applicationId= req.params.id;
        if(!status){
            return res.status(400).json({error: "Status is required"
                ,success:false
            });
        }
        //search for the application
        const application = await Application.findByIdAndUpdate(applicationId,{status},{new:true});

        if(!application){
            return res.status(404).json({error: "No application found with the given ID"
                ,success:false
            });
        }

        //update the application status
        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message:"Application status updated successfully",
            success:true,
            application
            
        })
    }

    catch(error)
    {
        console.error(error);
        res.status(500).json({error: "Failed to update application status"});
    }
}

const deleteApplication = async (req, res) => {
    try {
        const applicationId = req.params.id;
        const userId = req.id;

        // Find the application and verify ownership
        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({ 
                error: "Application not found", 
                success: false 
            });
        }

        if (application.applicant.toString() !== userId) {
            return res.status(403).json({ 
                error: "Unauthorized to delete this application", 
                success: false 
            });
        }

        // Remove application reference from Job
        await Job.findByIdAndUpdate(
            application.job,
            { $pull: { applications: applicationId } }
        );

        // Delete the application document
        await Application.findByIdAndDelete(applicationId);

        return res.status(200).json({
            message: "Application deleted successfully",
            success: true,
        });

    } catch (error) {
        console.error("[deleteApplication] Error:", error);
        res.status(500).json({ 
            error: "Failed to delete application", 
            success: false 
        });
    }
};

module.exports = {
    updateStatus,    getApplicants, getAppliedJobs,applyJob,deleteApplication
}