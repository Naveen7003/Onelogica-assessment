const express = require("express")
const { homepage, 
    managerSignup, 
    managerSignin, 
    getEmployeeList, 
    addPerformanceReview, 
    viewPerformanceReviews, 
    deletePerformanceReview, 
    updatePerformanceReview,
    currentManager,
    manageLeave } = require("../controllers/managerController");
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router()

router.get("/", homepage);

//Post Singup
router.post("/signup", managerSignup);

//Post Signin
router.post("/signin", managerSignin);

router.get("/currentManager", isAuthenticated, currentManager)

//get employelist
router.get("/employees", isAuthenticated, getEmployeeList); 

//post performance and review
router.post("/review/:employeeId", isAuthenticated, addPerformanceReview); 

//put manageleave
router.put("/leave/manage", isAuthenticated, manageLeave);

module.exports = router;