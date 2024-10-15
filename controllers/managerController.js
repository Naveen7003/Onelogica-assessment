const { catchAsyncErrors } = require("../middlewares/catchAsyncError");
const managerModel = require("../models/managerModel");
const employeeModel = require("../models/employeModel");
const ErrorHandler = require("../utils/ErrorHandler");
const { sendtoken } = require("../utils/SendToken");

// Homepage
exports.homepage = catchAsyncErrors(async(req, res, next) => {
    res.json({ message: "Manager Home page" });
});

// Signup
exports.managerSignup = catchAsyncErrors(async(req, res ,next) => {
    const Manager = await new managerModel(req.body).save();
    res.status(201).json(Manager);
});

// Signin
exports.managerSignin = catchAsyncErrors(async(req, res, next) => {
    const Manager = await managerModel.findOne({ email: req.body.email }).select("+password").exec();
    if (!Manager) {
        return next(new ErrorHandler("Manager with this Email Address not found", 404));
    }

    const isMatch = Manager.comparepassword(req.body.password);
    if (!isMatch) return next(new ErrorHandler("Wrong Credentials", 500));

    sendtoken(Manager, 200, res);
});

// Get all employees (Viewable only by manager)
exports.getEmployeeList = catchAsyncErrors(async (req, res, next) => {
    const employees = await employeeModel.find();
    res.status(200).json({ success: true, employees });
});

// Add performance review
exports.addPerformanceReview = catchAsyncErrors(async (req, res, next) => {
    const { reviewDate, rating, feedback } = req.body;
    const employee = await employeeModel.findById(req.params.employeeId);
    if (!employee) {
        return next(new ErrorHandler("Employee not found", 404));
    }

    employee.performanceReviews.push({
        manager: req.user.id,
        reviewDate,
        rating,
        feedback,
    });

    await employee.save();
    res.status(200).json({ success: true, message: "Review added successfully" });
});

// View performance reviews of an employee
exports.viewPerformanceReviews = catchAsyncErrors(async (req, res, next) => {
    const employee = await employeeModel.findById(req.params.employeeId).populate("performanceReviews.manager", "username");
    if (!employee) {
        return next(new ErrorHandler("Employee not found", 404));
    }

    res.status(200).json({ success: true, reviews: employee.performanceReviews });
});

// Delete a performance review
exports.deletePerformanceReview = catchAsyncErrors(async (req, res, next) => {
    const employee = await employeeModel.findOne({ "performanceReviews._id": req.params.reviewId });
    if (!employee) {
        return next(new ErrorHandler("Review not found", 404));
    }

    employee.performanceReviews = employee.performanceReviews.filter((review) => review._id.toString() !== req.params.reviewId);
    await employee.save();
    res.status(200).json({ success: true, message: "Review deleted successfully" });
});

// Update a performance review
exports.updatePerformanceReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, feedback } = req.body;
    const employee = await employeeModel.findOne({ "performanceReviews._id": req.params.reviewId });

    if (!employee) {
        return next(new ErrorHandler("Review not found", 404));
    }

    const review = employee.performanceReviews.find((review) => review._id.toString() === req.params.reviewId);
    if (!review) {
        return next(new ErrorHandler("Review not found", 404));
    }

    review.rating = rating || review.rating;
    review.feedback = feedback || review.feedback;

    await employee.save();
    res.status(200).json({ success: true, message: "Review updated successfully" });
});

// Manager approves or rejects leave
exports.manageLeave = catchAsyncErrors(async (req, res, next) => {
    const { employeeId, leaveId, action } = req.body; // action can be 'approve' or 'reject'
    
    const employe = await employeModel.findById(employeeId);
    if (!employe) {
      return next(new ErrorHandler("Employee not found", 404));
    }
  
    const leaveRequest = employe.leave.leaveHistory.id(leaveId);
    if (!leaveRequest) {
      return next(new ErrorHandler("Leave request not found", 404));
    }
  
    // Approving or rejecting the leave
    if (action === 'approve') {
      leaveRequest.status = 'approved';
      leaveRequest.approvedAt = Date.now();
      
      // Calculate leave days and update usedLeave
      const leaveDays = (new Date(leaveRequest.endDate) - new Date(leaveRequest.startDate)) / (1000 * 60 * 60 * 24);
      employe.leave.usedLeave += leaveDays;
  
      // Check if employee has enough leave balance
      if (employe.leave.usedLeave > employe.leave.totalLeave) {
        return next(new ErrorHandler("Not enough leave balance", 400));
      }
  
    } else if (action === 'reject') {
      leaveRequest.status = 'rejected';
      leaveRequest.approvedAt = Date.now();
    } else {
      return next(new ErrorHandler("Invalid action", 400));
    }
  
    await employe.save({ validateModifiedOnly: true });
  
    res.status(200).json({ success: true, message: `Leave ${action}ed successfully` });
  });
  
