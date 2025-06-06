const { catchAsyncErrors } = require("../middlewares/catchAsyncError");
const Task = require("../models/TaskModel");
const ErrorHandler = require("../utils/ErrorHandler");

// Homepage
exports.homepage = catchAsyncErrors(async (req, res, next) => {
  res.json({ message: "Manager Home page" });
});

// CREATE Task - Admin Only
exports.createTask = catchAsyncErrors(async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new ErrorHandler("Only admins can create tasks", 403));
  }

  const task = await Task.create({
    ...req.body,
    createdBy: req.user.id,
  });

  res.status(201).json({ success: true, task });
});

// READ All Tasks (Admin Only)
exports.getAllTasks = catchAsyncErrors(async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new ErrorHandler("Only admins can view all tasks", 403));
  }

  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  // Fetch all tasks (for sorting)
  const tasksRaw = await Task.find().lean(); // .lean() gives plain JS objects

  const priorityOrder = {
    high: 1,
    medium: 2,
    low: 3,
  };

  // Sort by priority and then by dueDate
  const sortedTasks = tasksRaw.sort((a, b) => {
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  // Paginate manually after sorting
  const paginatedTasks = sortedTasks.slice(skip, skip + limit);
  const totalPages = Math.ceil(sortedTasks.length / limit);

  res.status(200).json({
    success: true,
    tasks: paginatedTasks,
    totalPages,
    currentPage: page,
  });
});

// GET Task Details - Admin Only
exports.getTaskById = catchAsyncErrors(async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new ErrorHandler("Only admins can view task details", 403));
  }

  const task = await Task.findById(req.params.id);
  if (!task) return next(new ErrorHandler("Task not found", 404));

  res.status(200).json({ success: true, task });
});

// UPDATE Task - Admin Only
exports.updateTask = catchAsyncErrors(async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new ErrorHandler("Only admins can update tasks", 403));
  }

  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!task) return next(new ErrorHandler("Task not found", 404));

  res.status(200).json({ success: true, task });
});

// User: Update only task status
exports.updateTaskStatus = catchAsyncErrors(async (req, res, next) => {
  const { taskId, status } = req.body;

  const task = await Task.findById(taskId);
  if (!task) return next(new ErrorHandler("Task not found", 404));

  if (String(task.assignedTo) !== String(req.user._id)) {
    return next(
      new ErrorHandler("You are not authorized to update this task", 403)
    );
  }

  task.status = status;
  await task.save();

  res.status(200).json({ success: true, message: "Task status updated", task });
});

// Admin: Assign task to user
exports.assignTask = catchAsyncErrors(async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new ErrorHandler("Only admins can assign tasks", 403));
  }

  const { taskId, userId } = req.body;

  const task = await Task.findById(taskId);
  if (!task) return next(new ErrorHandler("Task not found", 404));

  const user = await UserModel.findById(userId);
  if (!user) return next(new ErrorHandler("User not found", 404));

  task.assignedTo = userId;
  await task.save();

  res
    .status(200)
    .json({ success: true, message: "Task assigned successfully", task });
});

// DELETE Task - Admin Only
exports.deleteTask = catchAsyncErrors(async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new ErrorHandler("Only admins can delete tasks", 403));
  }

  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return next(new ErrorHandler("Task not found", 404));

  res.status(200).json({ success: true, message: "Task deleted successfully" });
});
