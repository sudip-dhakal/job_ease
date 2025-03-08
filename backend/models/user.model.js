const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true,
    }
    ,
    role: {
        type: String, 
        default: "user",
        enum: ["user", "recruiter"],
        required: true,

    },
    resumeData: {  // Changed to match the other reference
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ResumeData',
    },
    profile: {
        bio: {
            type: String,
            default: "No Bio provided"
        },
        skills: {
            type: Array,
            default: []    
        },
        resume: {
            type: Object,
            default: {}
        },

        resumeOriginalName:{
            type: String,
            default: ""
        },
        profilePic:{
            type:String,
            default:"",
        },
        company:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Company'
        },
        

    }
},{timestamps:true});

module.exports = mongoose.model("User", userSchema);