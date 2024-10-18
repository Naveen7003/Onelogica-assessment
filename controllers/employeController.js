const { catchAsyncErrors } = require("../middlewares/catchAsyncError");
const employeModel = require("../models/employeModel");
const ErrorHandler = require("../utils/ErrorHandler");
const { sendtoken } = require("../utils/SendToken");
const managerModel = require("../models/managerModel")
const haversine = require('haversine-distance');

// GET Homepage
exports.homepage = catchAsyncErrors(async (req, res, next) => {
  res.json({ message: "Homepage" });
});

// POST /employe/signup - Employee Signup
exports.employesignup = catchAsyncErrors(async (req, res, next) => {
  const employe = await new employeModel(req.body).save();
  sendtoken(employe, 201, res);
  res.status(201).json({ success: true});
});

// POST /employe/signin - Employee Signin
exports.employesignin = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  const employe = await employeModel.findOne({ email }).select("+password").exec();

  if (!employe) {
    return next(new ErrorHandler("Employee with this email address not found", 404));
  }

  const isMatch = await employe.comparepassword(password); // Assuming comparePassword is defined in your model
  if (!isMatch) {
    return next(new ErrorHandler("Invalid credentials", 401));
  }

  sendtoken(employe, 200, res);
});

// POST /employe/signout - Employe Signout
exports.employesignout = catchAsyncErrors(async (req, res, next) => {
  res.clearCookie("token"); // Assuming token is stored in cookies
  res.status(200).json({ success: true, message: "Successfully signed out" });
});

exports.currentEmploye = catchAsyncErrors(async (req,res,next) =>{
  const employe = await employeModel.findById(req.id).exec();
  if (!employe) {
    return next(new ErrorHandler("Employee not found", 404));
  }
  res.status(200).json({ success: true, employe });
});

// GET /employe/profile - Employe Profile
exports.employeProfile = catchAsyncErrors(async (req, res, next) => {
  const employe = await employeModel.findById(req.id).exec(); // Assuming req.user contains the authenticated user info
  if (!employe) {
    return next(new ErrorHandler("Employee not found", 404));
  }
  res.status(200).json({ success: true, employe });
});

// PUT /employe/updateprofile - Update Employee Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const updatedData = {
    username: req.body.username,
    email: req.body.email,
    contact: req.body.contact,

  };

  const employe = await employeModel.findByIdAndUpdate(req.user.id, updatedData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({ success: true, employe });
});

// Function to calculate if the employee is within the radius of officelocation
const isWithinGeofence = (currentLocation, officeLocation, radius) => {
  const distance = haversine(currentLocation, officeLocation);
  return distance <= radius; // Return true if within radius, false otherwise
};

exports.markAttendance = catchAsyncErrors(async (req, res, next) => {
  const { attendanceDate, status, currentLatitude, currentLongitude } = req.body;

  const employe = await employeModel.findById(req.id);
  if (!employe) {
    return next(new ErrorHandler("Employee not found", 404));
  }

  // Find the manager to get the office location
  const manager = await managerModel.findOne({ username: employe.manager });
  if (!manager || !manager.officeLocation) {
    return next(new ErrorHandler("Manager or office location not found", 404));
  }

  // Office location from the manager's model
  const officeLocation = {
    latitude: manager.officeLocation.latitude,
    longitude: manager.officeLocation.longitude,
  };

  // Employee's current location data (received from the request)
  const currentLocation = {
    latitude: currentLatitude,
    longitude: currentLongitude,
  };

  // Check if the current location is within the 100-meter geofence radius
  const radiusInMeters = 100; // Set the radius to 100 meters
  const isInsideGeofence = isWithinGeofence(currentLocation, officeLocation, radiusInMeters);

  if (!isInsideGeofence) {
    return res.status(403).json({ success: false, message: "You are not within the allowed geofence to mark attendance." });
  }

  // If within the geofence, mark attendance
  employe.attendance.checkIns.push({ date: attendanceDate, status });
  await employe.save({ validateModifiedOnly: true });

  res.status(200).json({ success: true, message: "Attendance marked successfully." });
});

// GET /employe/attendance - View Attendance
exports.viewAttendance = catchAsyncErrors(async (req, res, next) => {
  const employe = await employeModel.findById(req.id).select("attendance");
  if (!employe) {
    return next(new ErrorHandler("Employee not found", 404));
  }

  res.status(200).json({ success: true, attendance: employe.attendance });
});

// Employee applies for leave
exports.applyLeave = catchAsyncErrors(async (req, res, next) => {
  const { startDate, endDate, leaveType } = req.body;

  const employe = await employeModel.findById(req.id);
  if (!employe) {
    return next(new ErrorHandler("Employee not found", 404));
  }

  // Add leave request to leaveHistory
  employe.leave.leaveHistory.push({ 
    leaveType, 
    startDate, 
    endDate, 
    status: 'pending' 
  });

  await employe.save({ validateModifiedOnly: true });

  res.status(200).json({ success: true, message: "Leave request submitted, waiting for approval." });
});

// GET /employe/leavehistory - View Leave History
exports.viewLeaveHistory = catchAsyncErrors(async (req, res, next) => {
  const employe = await employeModel.findById(req.id).select("leaveRequests");
  if (!employe) {
    return next(new ErrorHandler("Employee not found", 404));
  }

  res.status(200).json({ success: true, leaveRequests: employe.leaveRequests });
});



exports.uploadDocument = catchAsyncErrors(async (req, res, next) => {
  const employe = await employeModel.findById(req.id);
  if (!employe) {
      return next(new ErrorHandler("Employee not found", 404));
  }

  const { documentType } = req.body; // E.g., 'resume' or 'certification'
  
  if (documentType === 'resume') {
      employe.documents.resume = { filename: req.file.filename, path: req.file.path }; // Storing resume
  } else if (documentType === 'certification') {
      employe.documents.certifications.push({ filename: req.file.filename, path: req.file.path }); // Storing certification
  } else {
      return next(new ErrorHandler("Invalid document type", 400));
  } 
  await employe.save({ validateModifiedOnly: true });

  res.status(200).json({ success: true, message: "Document uploaded" });
});

