const express = require("express");
const { homepage,
    employesignup,
    employesignin,
    employesignout,
    currentEmploye,
    employeProfile,
    markAttendance,
    applyLeave,
    viewLeaveHistory,
    viewAttendance,
    uploadDocument,
    fetchDocument,
    deleteDocument
    } = require("../controllers/employeController");
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router();
const upload = require('../multerConfig');

//Get /homepage
router.get("/", homepage)

//Post /employe/signup
router.post("/signup", employesignup);

//Post /employe/signin
router.post("/signin", employesignin);

//Post /employe/signout
router.post("/signout", isAuthenticated, employesignout);

//get currentemploye
router.get("/currentEmploye", isAuthenticated, currentEmploye)

//Get /employe/profile
router.get("/profile", isAuthenticated, employeProfile);

// Get /employe/attendance
router.get("/attendance", isAuthenticated, viewAttendance);

// Post /employe/attendance/mark
router.post("/attendance/mark", isAuthenticated, markAttendance );

// Post /employe/leave
router.post("/leave", isAuthenticated, applyLeave);

// Get /employe/leavehistory
router.get("/leavehistory", isAuthenticated, viewLeaveHistory);

// POST /employe/document/upload - Upload Document
router.post('/document/upload', upload.single('document'), uploadDocument);



module.exports = router;