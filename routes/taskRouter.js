const express = require("express");
const router = express.Router();
const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const { isAuthenticated } = require("../middlewares/auth");

// Apply isAuthenticated middleware and let controller handle role check
router.post("/task", isAuthenticated, createTask);
router.get("/tasks", isAuthenticated, getAllTasks);
router.get("/task/:id", isAuthenticated, getTaskById);
router.put("/task/:id", isAuthenticated, updateTask);
router.delete("/task/:id", isAuthenticated, deleteTask);

module.exports = router;
