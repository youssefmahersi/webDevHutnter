const express = require("express");
 
const router = express.Router();
const User = require("../models/user");
const Chat = require("../models/chat");
const isAuth = require("../utilities/is-auth");

router.get("/chats",isAuth,async(req,res,next)=>{
    const userId = req.userId;
    const user = await User.findById(userId);
    if(user.type === "developer"){
        var chats = await Chat.find({devId:userId});
    }else{
        var chats = await Chat.find({clientId: userId});
    }
    
    return res.status(200).json({chats})

});
router.get("/:channelId",isAuth,async(req,res,next)=>{
    const channelId = req.params.channelId;
    const channel = await Chat.findById(channelId);

    return res.status(200).send(channel);
});
router.get("/refresh",isAuth,async(req,res,next)=>{
    const userId = req.userId;
    const user = await User.findById(userId);
    return res.status(201).send(user);
})

module.exports = router;