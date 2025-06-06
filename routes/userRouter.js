const express = require("express");
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router();
const upload = require("../multerConfig");
const {
  userSignup,
  userSignin,
  userSignout,
  homepage,
} = require("../controllers/userController");

//Get /homepage
router.get("/", homepage);

//Post /employe/signup
router.post("/signup", userSignup);

//Post /employe/signin
router.post("/signin", userSignin);

//Post /employe/signout
router.post("/signout", isAuthenticated, userSignout);

module.exports = router;
