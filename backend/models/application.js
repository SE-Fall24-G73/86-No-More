const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
    
    jobid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'

    },
   
    jobname:{
        type:String,
        required:true,
        
    },
    applicantid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'

    },
    manageremail: {
        type: String,
        default:''
        
    }
    ,
    applicantname: {
        type: String,
        required: true,
        default:''
        
    },
    managername: {
        type: String,
        default:''
        
    },
    address: {
        type: String,
        default:''
       
    },
    phonenumber:{
        type:String,
        default:''
        
    },
    hours:{
        type:String,
        default:''
        
    },
    dob:{
        type:String,
        default:''
        
    },
    gender:{
        type:String,
        default:''
        
    },
    skills:{
        type:Array,
        
    },
    status: {
        type: String,
        default: "0",
    },
    jobname: {
        type:String,
        
        required:true
    },
    jobid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    },
    
});


const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;