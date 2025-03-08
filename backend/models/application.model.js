const mongoose= require('mongoose');

const applicationSchema = new mongoose.Schema({
    job:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Job",
        required:true,
    },

    applicant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    status:{
        type:String,
        enum:["pending", "accepted", "rejected"],
        default:"pending",
        required:true,
    },  matchingScore: {
        type: Number,  // Store the matching score as a number
        default: 0,
    },

},{timestamps:true});

const Application = mongoose.model('Application', applicationSchema);


module.exports = { Application };  
