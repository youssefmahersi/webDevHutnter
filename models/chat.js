const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const chatSchema = new Schema({
    chatName: { 
        type:String,
        required:true
    },
    clientId : {
        type : Schema.Types.ObjectId,
        required : true,
        ref : "user"
    },
    devId :{
        type : Schema.Types.ObjectId,
        required : true,
        ref : "user"
    },
    chat : [
        {
            senderId :{
                type : Schema.Types.ObjectId,
                required : true,
                ref : "user"
            },
            profilePicture: {type:String,required:true},
            username:  {type:String,required:true},
            message : {type:String,required:true},
            date: {type:Date,required:true}
        }
    ]
});


module.exports = mongoose.model("Chat",chatSchema);