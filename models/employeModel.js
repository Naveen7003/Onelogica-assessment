const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

const employeModel = new mongoose.Schema({

    employename:{
        type:String,
        required:[true,"First Name is required"],
        maxLength:[20,"First Name should not exceed more than 20 characters"],
        },
        contact:{
         type:Number,
         required:[true,"Contact is required"],
         maxLength:[10,"Contact should not exceed more than 10 characters"],
         minLength:[10,"Contact should be atleast more than 10 characters"],
         },
        email:{
         type:String,
         required:[true,"Email is required"],
         match: [ /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ , "Email address is invalid!"],
         unique:true
        },
        password: {
         type:String,
         required:[true, "password is required"],
         select:false,
         maxLength:[15,"Password should not exceed more than 15 characters"],
         minLength:[3,"Password should have atleast 3 characters"],
         //match:[/^(?=.\d)(?=.[a-z])(?=.[A-Z])(?=.[^a-zA-Z0-9]).{8,1024}$/]
        },
        jobDetails: {
         jobRole: { type: String, default:"Developer" },
         department: { type: String, default: "IT"},
       },
       performanceHistory: [
        {
          reviewDate: { type: Date, default : Date.now, unique:true },
          rating: { type: Number }, // Rating system: 1 to 5
          feedback: [{ type: String }],
        },
      ],
      documents: {
        resume: {
          filename: { type: String,  }, // Not necessary unless you want to store it
          path: { type: String } // Path or URL to the resume document
        },
        certifications: [
          {
            filename: { type: String }, // Name of the certification file
            path: { type: String } // Path or URL to the certification document
          }
        ]
      },
      attendance: {
        checkIns: [{
          date: { type: Date,unique:true, default: Date.now },
          status: { type: String, enum: ['Present', 'Absent', 'Late'], default: 'Present' } // Example statuses
        }],
      },
      leave: {
        totalLeave: { type: Number, default: 20 }, // e.g., 20 days of annual leave
        usedLeave: { type: Number, default: 0 },
        leaveHistory: [
          {
            leaveType: { type: String }, // e.g., vacation, sick, personal
            startDate: { type: Date },
            endDate: { type: Date },
            status: { type: String, default: 'pending' }, // pending, approved, rejected
          },
        ],
      },
      manager: {
        type: String,
        required: true
    },
    createdAt: { type: Date, default: Date.now },
  });
  

employeModel.pre("save", function(){
    if(!this.isModified("password")){
    return;
 }   
    let salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt)
})

employeModel.methods.comparepassword = function(password){
    return bcrypt.compareSync(password, this.password)
}

employeModel.methods.getjwttoken = function(){             //jb bhi ye call hoga to token generate hojayega iske liye alag se utils mai sendtoken file bayenge
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}


module.exports = mongoose.model("Employe", employeModel);