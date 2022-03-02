const User = require("../models/user");
const topRate = require("../utilities/topRated");
const topProjects = require("../utilities/topProjects");
const Project = require("../models/project");
exports.editUser = async(req,res,next)=>{

    try{
        const username = req.body.username;
        const user = await User.findOne({username});
        if(!user){
            const error = new Error('User not found !');
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        } 
        user.employerInfo = {
            description : req.body.description||" ",
            location: req.body.location||" "
        }
        const result = await user.save();
        return res.status(201).send("Employer information modified successfuly !");
        
    }
    catch(err){
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    }
}

exports.getDeveloperInfo = async(req,res,next)=>{
    try{
    const devId = req.params.devoleperId;
    const developer = await User.findById(devId);
    const devProjects = await Project.find({userId:devId});

    return res.status(200).json({developer:developer,projects: devProjects});
}catch(err){
    if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
}

    
}


exports.home = async(req,res,next)=>{
    try{
    var bestRated = await topRate();
    var bestProjects =await topProjects();
    return res.status(200).json({bestRated,bestProjects});
}
catch(err){
    if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
}  
}

exports.findDeveloper = async(req,res,next)=>{
    try{
        const tags = req.body.tags ;
        const location = req.body.location;
        const users = await User.find({type : "developer",location :location});
        var usersCopy = users;
        for(var user of usersCopy){
            var sameTags = tags.filter((tag)=>user.developerInfo.tags.includes(tag));
            user.index = sameTags;
        }
        
        const sortedUsers = usersCopy.sort(function (a, b) {
            return b.index - a.index;
          });
        return res.status(200).json({sortedUsers});



    }catch(err){
    if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
} 
}

exports.sendRequest =async(req,res,next)=>{
    try{
    const devId = await User.findById(req.body.devId);
    const userId = req.userId;
    const user = await User.findById(userId);
    const dev = await User.findById(devId);
    const findRequest = dev.developerInfo.requests.find((request)=> request.clientId.toString()=== user._id);
    if(findRequest){
        return res.status(400).send("Alerady repeust is pending !");
    }
    dev.developerInfo.requests.push({
        clientId:userId,
        clientName : user.username,
        clientPicture: user.profilPicture,
        requestDesc : req.body.demande||" "
    });
    const result = await dev.save();
    
    
    return res.status(200).send("request sent seccessfuly !");
}catch(err){
    if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
} 

}


exports.commentProject  = async(req,res,next)=>{
    const projectId = req.body.projectId ;
    try{
        const user = await User.findById(req.userId);
        const project = await Project.findById(projectId);
        var comment = {
            clientId:user._id,
            clientName : user.username,
            clientPicture: user.profilPicture,
            comment : req.body.comment
        }
        project.comments.push(comment
            )
            
        const result = await project.save();
        return res.status(201).json({"message": "comment added successfuly !",comment})
    }catch(err){
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    } 

}
exports.feedback = async(req,res,next)=>{
    try{

    
    const devId = req.body.devId;
    const user = await User.findById(req.userId);
    const dev = await User.findById(devId);
    const findFeedback = dev.devInfo.clientsFeedback.find(feedback => feedback.clientId.toString()=== user._id.toString());
    if(findFeedback){
        return res.status(401).send("alerady have feedback !");

    }
    dev.devInfo.clientsFeedback.push({
        clientId:user._id,
        clientName : user.username,
        clientPicture: user.profilPicture,
        rate: req.body.rate
    })
    var newRating=0;
        for (var feedback of dev.devInfo.clientsFeedback){
            newRating=+feedback.rating;

        }
        newRating = newRating/dev.devInfo.clientsFeedback.length
    dev.rating = newRating;
    const result = await dev.save();

    return res.status(201).send("feedback added successfuly !");
    
}catch(err){
    if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
} 
}