const User = require("../models/user");
const { validationResult } = require('express-validator');
const path = require("path");
const Project = require("../models/project");
const sgMail = require('@sendgrid/mail');
const Chat = require("../models/chat");

exports.createProject = async(req,res,next)=>{
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const projectName = req.body.projectName;
    const githublink = req.body.githubLink;
    const desc = req.body.description;
    const userId = req.userId;
    var f=[];
    for(var file of req.files||[]){
        f.push({
            type : file.mimetype,
            link : path.join("images",file.filename)
        })
    }
    
    try{    
        const user = await User.findById(userId);
        const proj = {
            projectName : projectName,
            userId : userId,
            profilPicture :user.profilPicture,
            githubLink: githublink,
            rating:0,
            description : desc,
            snapshots: f,
            comments:[] 
        }
        const project = new Project(proj);

        var result = await user.save();
        result = await project.save();
        return res.status(201).json({message:"Project created successfully !",project:proj})

    }catch(err){
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
      }
     
}



exports.getProfil = async(req,res,next)=>{
    const userId = req.userId;
    try{
    const user = await user.findById(userId);
    
    return res.status(200).json({user});
    }
    catch(err){
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
      }
    }
exports.getProject = async(req,res,next)=>{
    const userId = req.userId;
    const projectId = req.params.projectId;
    const user = await User.findById(userId);
    const dedicatedProject = user.projects.find((project) => project._id.toString()=== projectId.toString());
    if(!dedicatedProject){
        return res.status(404).json({"message": "project not found !"});

    }
    return res.status(200).json({project : dedicatedProject})
}


exports.editUser = async(req,res,next)=>{
    try{
        const fields = JSON.parse(req.body.info);
        const username = req.body.username;
        const user = await User.findOne({username});
        if(!user){
            const error = new Error('User not found !');
            error.statusCode = 422;
            throw error;
        }
        const developerInfo = {
            githubLink: fields.githubLink||" ",
            linkedinLink:fields.linkedinLink||" ",
            location :fields.location||" ",
            tags: fields.tags|| [],
            cvImageUrl :req.files?.cv[0].filename|| " ",
            description: fields.description||" ",
            bio: fields.bio||" "
        }
        user.profilPicture = req.files?.profilePicture[0].filename|| " "
        user.developerInfo ={
            ...developerInfo
        }

        const result = await user.save();
        return res.status(201).send("Developer information modified successfuly !");
        
    }
    catch(err){
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    }
    
    
}

exports.respondRequest = async(req,res,next)=>{
    try{
    const requestId = req.body.requestId;
    const user = await User.findById(req.body.userId);
    const dev = await User.findById(req.userId);
    if(req.body.response){
        const chat = new Chat({
            chatName : user.username+"&"+dev.username,
            clientId : user._id,
            devId :dev._id,
            chat : []
        })
        const result = await chat.save();

    }
    const newRequests = dev.developerInfo.requests.filter(request => request._id.toString() !== requestId.toString());
    dev.developerInfo.requests = newRequests;
    const result = await dev.save();
    return res.status(200).json({"message": "operation done successfuly !"})
    }
    catch(err){
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    }
}
