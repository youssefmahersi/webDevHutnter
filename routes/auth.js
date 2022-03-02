const express = require("express");
 
const router = express.Router();
const User = require("../models/user");
const { body } = require('express-validator');
const authController = require("../controllers/auth");

const fileUpload = require("../utilities/multer-config");

router.put("/signup",[
    body("username").trim().notEmpty()
    .withMessage('username is required')
    .not()
    .custom((val) => /[^A-za-z0-9\s]/g.test(val))
    .withMessage('Username not use uniqe characters')
    .isLength({min:4})
    .withMessage("username must contain at least  4 characters ")
    .custom((value, { req }) => {
      return User.findOne({ username: value }).then(userDoc => {
        if (userDoc) {
          return Promise.reject('Username already exists!');
        }
      });
    }),
    body("email").isEmail()
    .withMessage('Please enter a valid email.')
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then(userDoc => {
        if (userDoc) {
          return Promise.reject('E-Mail address already exists!');
        }
      });
    })
    .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 5 })
      .withMessage("password must contain at least 5 characters"),
    body("type")
    .notEmpty()
],authController.signup);


router.post("/login",authController.login);
router.post("/dev-info",fileUpload.fields([
    { name: "cv", maxCount: 1 },
    { name: "profilePicture", maxCount: 1 },]),authController.developerInfo);
router.post("/employer-info",fileUpload.fields([
  { name: "profilePicture", maxCount: 1 }]),authController.employerInfo);
module.exports = router;