const User = require("../models/user");

module.exports = async()=>{
    const users = await User.find({type:"developer"}).sort({rating : -1});
    return users;
}

