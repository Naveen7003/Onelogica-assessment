const { catchAsyncErrors } = require("../middlewares/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");
const { sendtoken } = require("../utils/SendToken");
const taskModel = require("../models/TaskModel");
const haversine = require("haversine-distance");
const UserModel = require("../models/UserModel");

// GET Homepage
exports.homepage = catchAsyncErrors(async (req, res, next) => {
  res.json({ message: "Homepage" });
});

// POST /employe/signup - Employee Signup
exports.userSignup = catchAsyncErrors(async (req, res, next) => {
  const user = await new UserModel(req.body).save();
  sendtoken(user, 201, res);
  res.status(201).json({ success: true });
});

// POST /user/signin - user Signin
exports.userSignin = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email }).select("+password").exec();

  if (!user) {
    return next(
      new ErrorHandler("Employee with this email address not found", 404)
    );
  }

  const isMatch = await user.comparepassword(password);
  if (!isMatch) {
    return next(new ErrorHandler("Invalid credentials", 401));
  }

  sendtoken(user, 200, res);
});

// POST /employe/signout - Employe Signout
exports.userSignout = catchAsyncErrors(async (req, res, next) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Successfully signed out" });
});
