const express = require("express");
 
const router = express.Router();
const User = require("../models/user");
const { body } = require('express-validator');
const employerController = require("../controllers/employer");
const isAuth = require("../utilities/is-auth");

router.post("/edit-info",isAuth,employerController.editUser);

router.get("/home",isAuth,employerController.home);
router.post("/find-dev",isAuth,employerController.findDeveloper);
router.post("/feedback",isAuth,employerController.feedback);
router.post("/comment-project",isAuth,employerController.commentProject);
router.post("/send-request",isAuth,employerController.sendRequest);
router.get("/:devoleperId",isAuth,employerController.getDeveloperInfo); 
module.exports = router;