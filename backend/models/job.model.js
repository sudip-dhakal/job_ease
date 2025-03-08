const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    requirements: { type: String, required: true },

    description: {
      type: String,
      required: true,
    },
    descriptionFile: {
      type: String, // Store the URL or file path of the uploaded PDF
      required: false, // Make it optional
    },

    salary: {
      type: Number,
      required: true,
    },
    experienceLevel: {
      type: Number,
      required: true,
    },
    parsedEntities: {
      type: mongoose.Schema.Types.Mixed, // Flexible schema to store various extracted entities (object or array)
    },

    location: {
      type: String,
      required: true,
    },
    postedDate: {
      type: Date,
      default: Date.now,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Company",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    jobType: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model("Job", jobSchema);

module.exports = { Job };
