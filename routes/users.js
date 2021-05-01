const express=require('express');
const router=express.Router();
const passport=require('passport');
const jwt= require('jsonwebtoken');

const config=require('../config/database');
const User=require('../models/user');
const { json } = require('body-parser');
const { session } = require('passport');

// Routing to Register Page

router.post('/register',(req, res, next)=>{
    // console.log("screen 2!!!!!!!!!!!!!!!!!!!!!!!!!");
    let newuser= new User({
        name:req.body.name,
        email:req.body.email,
        username:req.body.username,
        password:req.body.password
    });

    // console.log(newuser.name);

User.addUser(newuser,(err,user)=>{
    if(err){
        res.json({success:false, msg:'Failed to register'});
    }
    else{
        res.json({success:true, msg:'User registered'});
    }
  });
});

//Routing to Authenticate Page
router.post('/authenticate',(req, res, next)=>{
    const username= req.body.username;
    const password= req.body.password;

    User.getUserByUserName(username, (err,user)=>{
        if(err) throw err;
        if(!user){
            return res.json({success:false, msg:'User not found'});
        }

        User.comparePassword(password, user.password,(err, isMatch)=>{
            if(err) throw err;
            if(isMatch){
                const token= jwt.sign({data:user},config.secret,{
                    expiresIn :604800 // 1 weak
                });
                res.json({
                success:true,
                token: 'JWT '+token,
                user:{
                    id:user._id,
                    name:user.name,
                    email:user.email
                }
            });
            } else{
                return res.json({success:false, msg:'Wrong password'});
            }
            
        });

    });
    //res.send("Authenticate");
});

//Routing to Profile Page{
router.get('/profile',passport.authenticate('jwt',{session:false}),(req, res, next)=>{
    res.json({user: req.user});
    //res.json({success:false, msg:'Failed to register'});
});
 module.exports= router;