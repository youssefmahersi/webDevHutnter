const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Project = require("../models/project");
const path = require("path");
exports.signup = async (req, res, next) => {
  try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const type = req.body.type;
    const hashedPw = await bcrypt.hash(password, 12);
    const user = new User({
        username :username,
        email: email,
        password: hashedPw,
        type: type,
        profilPicture: " ",
        rating:0,
        employerInfo:{
            description: "",
            location : ""
        },
        developerInfo:{
            
            githubLink: "",
            linkedinLink:"",
            location :"",
            tags: "",
            certificats: [],
            bio : "",
            description : "",
            cvImageUrl: "",
            clientsFeedback:[],
            requests:[],
        },
        chatRooms: []       
    });
    const result = await  user.save();

    res.status(201).json({ message: 'User created!', userId: result._id });

  }
  catch(err){
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
}
};

exports.developerInfo = async(req,res,next)=>{

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
        return res.status(201).send("Developer information added successfuly !");
        
    }
    catch(err){
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    }
    
    
}
exports.employerInfo = async(req,res,next)=>{
    try{
        const username = req.body.username;
        const user = await User.findOne({username});
        if(!user){
            const error = new Error('User not found !');
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        } 
        user.profilPicture = req.files?.profilePicture[0].filename|| " "
        user.employerInfo = {
            description : req.body.description||" ",
            location: req.body.location||" ",
        }
        const result = await user.save();
        return res.status(201).send("Employer information added successfuly !");
        
    }
    catch(err){
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    }
}

  exports.login = async(req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    try{

    
    const user = await User.findOne({ email: email });
    
     const projects = await Project.find({userId: user._id});
    if (!user) {
          const error = new Error('A user with this email could not be found.');
          error.statusCode = 401;
          throw error;
        }
    const isEqual= await  bcrypt.compare(password, user.password)
    if (!isEqual) {
          const error = new Error('Wrong password!');
          error.statusCode = 401;
          throw error;
    }
     const token = jwt.sign(
          {
            email: user.email,
            userId: user._id.toString()
          },
          process.env.JSONSECRET,
          { expiresIn: '24h' }
        );
    return res.status(200).json({ token, user,projects

    });
}catch(err){
    if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
}
}
  