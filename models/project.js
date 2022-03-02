const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const projectSchema = new Schema({
    
        projectName : {type:String,required:true},
        userId : {
            type : Schema.Types.ObjectId,
            required : true,
            ref: "user"
        },
        profilPicture : {type:String,required:true},
        githubLink: {type:String,required:true},
        description : {type:String,required:true},
        snapshots: [
            {
                type: {type:String,required:true},
                link: {type:String,required:true}
            }
        ],
        comments:[
            {
                clientId: {
                    type : Schema.Types.ObjectId,
                    required : true
                },
                clientName : {type:String,required:true},
                clientPicture: {type:String,required:true},
                comment : {type:String,required:true}
            }
        ]
    }
)


module.exports = mongoose.model('Project', projectSchema);