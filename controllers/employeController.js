const { catchAsyncErrors } = require("../middlewares/catchAsyncError");
const employeModel = require("../models/employeModel");
const ErrorHandler = require("../utils/ErrorHandler");
const { sendtoken } = require("../utils/SendToken");

// GET Homepage
exports.homepage = catchAsyncErrors(async (req, res, next) => {
  res.json({ message: "Homepage" });
});

// POST /employe/signup - Employee Signup
exports.employesignup = catchAsyncErrors(async (req, res, next) => {
  const employe = await new employeModel(req.body).save();
  sendtoken(employe, 201, res);
  res.status(201).json({ success: true, employe });
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

// POST /employe/signout - Employee Signout
exports.employesignout = catchAsyncErrors(async (req, res, next) => {
  res.clearCookie("token"); // Assuming token is stored in cookies
  res.status(200).json({ success: true, message: "Successfully signed out" });
});

// GET /employe/profile - Employee Profile
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

// POST /employe/attendance/mark - Mark Attendance
exports.markAttendance = catchAsyncErrors(async (req, res, next) => {
  const { attendanceDate, status } = req.body;

  const employe = await employeModel.findById(req.id);
  if (!employe) {
    return next(new ErrorHandler("Employee not found", 404));
  }

  // Push attendance data into checkIns array
  employe.attendance.checkIns.push({ date: attendanceDate, status });
  await employe.save({ validateModifiedOnly: true });

  res.status(200).json({ success: true, message: "Attendance marked" });
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



// POST /employe/document/upload - Upload Document
exports.uploadDocument = catchAsyncErrors(async (req, res, next) => {
  const employe = await employeModel.findById(req.id);
  if (!employe) {
    return next(new ErrorHandler("Employee not found", 404));
  }

  const { documentType } = req.body; // E.g., 'resume' or 'certification'
  
  if (documentType === 'resume') {
    employe.documents.resume = { filename: 'resume', path: req.body.path }; // Storing resume
  } else if (documentType === 'certification') {
    employe.documents.certifications.push({ filename: req.body.filename, path: req.body.path }); // Storing certification
  } else {
    return next(new ErrorHandler("Invalid document type", 400));
  } 
  await employe.save({ validateModifiedOnly: true });

  res.status(200).json({ success: true, message: "Document uploaded" });
});

// GET /employe/document/:id - Fetch Document
exports.fetchDocument = catchAsyncErrors(async (req, res, next) => {
  const employe = await employeModel.findById(req.user.id).select("documents");
  
  const { documentType } = req.query; // E.g., 'resume' or 'certification'
  
  let document;
  if (documentType === 'resume') {
    document = employe.documents.resume;
  } else if (documentType === 'certification') {
    document = employe.documents.certifications.find((cert) => cert._id.toString() === req.params.id);
  }

  if (!document) {
    return next(new ErrorHandler("Document not found", 404));
  }

  res.status(200).json({ success: true, document });
});



// DELETE /employe/document/:id - Delete Document
exports.deleteDocument = catchAsyncErrors(async (req, res, next) => {
  const employe = await employeModel.findById(req.user.id);
  
  const { documentType } = req.body; // E.g., 'resume' or 'certification'
  
  if (documentType === 'resume') {
    employe.documents.resume = null; // Deleting the resume
  } else if (documentType === 'certification') {
    const documentIndex = employe.documents.certifications.findIndex((cert) => cert._id.toString() === req.params.id);
    
    if (documentIndex === -1) {
      return next(new ErrorHandler("Document not found", 404));
    }

    employe.documents.certifications.splice(documentIndex, 1); // Deleting the certification
  } else {
    return next(new ErrorHandler("Invalid document type", 400));
  }

  await employe.save();

  res.status(200).json({ success: true, message: "Document deleted" });
});

