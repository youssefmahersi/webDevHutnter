const Project = require("../models/project");

module.exports = async()=>{
    const projects = await Project.find().sort({rating : -1});
    return projects;
}

