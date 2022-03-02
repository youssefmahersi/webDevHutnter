
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({

        username:{type:String,required:true},
        email:{type:String,required:true},
        password:{type:String,required:true},
        profilPicture:{type:String}, 
        type:{type:String,required:true},
        rating: {type:Number,required:true},
        developerInfo:{
            
            githubLink: {type:String},
            linkedinLink:{type:String},
            location :{type:String},
            tags: {type:Array},
            bio : {type:String},
            description : {type:String},
            cvImageUrl: {type:String},
            clientsFeedback:[
                {
                    clientId: {
                        type : Schema.Types.ObjectId,
                        required : true
                    },
                    clientName : {type:String,required:true},
                    clientPicture: {type:String,required:true},
                    rating: {type:Number,required:true}
                }
            ],
            requests:[
                {
                    clientId: {
                        type : Schema.Types.ObjectId,
                        required : true
                    },
                    clientName : {type:String,required:true},
                    clientPicture: {type:String,required:true},
                    requestDesc : {type:String,required:true}
                }
            ]
        },
        employerInfo:{
            description: {type:String},
            location : {type:String}
        },
        chatRooms:[
            {
                roomId:{
                    type : Schema.Types.ObjectId,
                    required : true,
                    ref : "chat"
                }
            }
        ]
})

module.exports = mongoose.model('User', userSchema);