const express = require("express")
const { homepage, 
    managerSignup, 
    managerSignin, 
    getEmployeeList, 
    addPerformanceReview, 
    viewPerformanceReviews, 
    deletePerformanceReview, 
    updatePerformanceReview,
    manageLeave } = require("../controllers/managerController");
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router()

router.get("/", homepage);

//Post Singup
router.post("/signup", managerSignup);

//Post Signin
router.post("/signin", managerSignin);

//get employelist
router.get("/employees", isAuthenticated, getEmployeeList); 

//post performance and review
router.post("/review/:employeeId", isAuthenticated, addPerformanceReview); 

//get viewreviews
router.get("/reviews/:employeeId", isAuthenticated, viewPerformanceReviews); 

//delete review
router.delete("/review/:reviewId", isAuthenticated, deletePerformanceReview);

//put updatereview
router.put("/review/:reviewId", isAuthenticated, updatePerformanceReview); // Update a performance review

//put manageleave
router.put("/manager/leave/manage", isAuthenticated, manageLeave);

module.exports = router;