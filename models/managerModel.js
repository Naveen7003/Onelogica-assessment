const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const managerModel = new mongoose.Schema({
    username:{
        type:String,
        required:[true , "Username is required!"],
        unique:[true, "Username already Exist"],
        minLength : [3, "Username should atleast have 3 Characters"],
        maxLength : [15, "Username should atmost have 15 Characters"]
    },
    email: {
        type:String,
        required:[true , "Email is required!"],
        unique:[true, "Email already Exist"],
        match: [ /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ , "Email address is invalid!"],
    },
    password: {
        type:String,
        required:[true , "Password is required!"],
        // match: [ ,""],
        maxLength: [15, "Password must be less than 15 Characters"],
        minLength: [6, "Password should have atleast 6 Characters"],
    },
    role: {
        type: String,
        default: "manager",
      },
    performanceReviews: [
        {
          employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employe' },
          reviewDate: { type: Date },
          rating: { type: Number },
          feedback: { type: String },
        },
    ],
    officeLocation: {
        latitude: { type: Number, required: true }, // Office latitude
        longitude: { type: Number, required: true }, // Office longitude
        radius: { type: Number, default: 100 }, // Geofence radius in meters
    },
}, {timestamps:true})

managerModel.pre("save", function(){
    if(!this.isModified("password")){
        return;
    }

    let salt = bcrypt.genSaltSync(10)
    this.password = bcrypt.hashSync(this.password, salt)
})

managerModel.methods.comparepassword = function(password){
    return bcrypt.compareSync(password, this.password)
}

managerModel.methods.getjwttoken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

module.exports = mongoose.model("Manager", managerModel)