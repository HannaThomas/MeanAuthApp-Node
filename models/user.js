const mongoose= require('mongoose');
const bcrypt= require('bcryptjs');
const config= require('../config/database');


// user schema
const userSchema= mongoose.Schema({
    name: {
        type:String
    },
    email:{
        type: String,
        require:true
    },
    username: {
        type:String,
        require:true
    },
    password: {
        type :String,
        require:true
    }
});


const User= module.exports=mongoose.model('user',userSchema);

module.exports.getUserById= function(id,callback){
    User.findById(id,callback);
}


module.exports.getUserByUserName= function(username,callback){
    const query={username:username}
    User.findOne(query,callback);
}
module.exports.addUser= function(newuser,callback){
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(newuser.password,salt,(err,hash)=>{
            if(err) throw err;
            newuser.password=hash;
            newuser.save(callback);
        });
    });
}
module.exports.comparePassword= function(candidatepassword,hash, callback){
    bcrypt.compare(candidatepassword,hash,(err,isMatch)=>{
        if(err) throw err;
        callback(null, isMatch);
    })
}