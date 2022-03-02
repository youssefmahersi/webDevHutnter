const express = require("express");
 
const router = express.Router();
const User = require("../models/user");
const developerController = require("../controllers/developer");
const isAuth = require("../utilities/is-auth");
const fileUpload = require("../utilities/multer-config");

router.post("/create-project",isAuth,fileUpload.array('snapshots', 5),developerController.createProject);

router.get("/profil",isAuth,developerController.getProfil);



router.post("/edit-user",isAuth,fileUpload.fields([
    { name: "cv", maxCount: 1 },
    { name: "profilePicture", maxCount: 1 },]),developerController.editUser);

router.post("/response",isAuth,developerController.respondRequest );
router.get("/:projectId",isAuth,developerController.getProject);
module.exports = router;