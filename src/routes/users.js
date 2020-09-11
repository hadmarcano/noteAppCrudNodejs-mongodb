const express = require('express');
const User = require('../models/Users');
const { text } = require('express');
const passport = require('passport');

const router = express.Router();

router.get('/users/signin',(req,res)=>{
    res.render('users/signin');
})

router.post('/users/signin',passport.authenticate('local',{
    successRedirect:'/notes',
    failureRedirect:'/Users/signin',
    failureFlash: true
}));

router.get('/users/signup',(req,res)=>{
    res.render('users/signup');
})

router.post('/users/signup', async (req,res)=>{
    //console.log(req.body);
    const {name,email,password,confirm_password} = req.body;
    let errors = [];
    if(name.length <= 0){
        errors.push({text:'Please insert your Name'})
    }
    if(password != confirm_password){
        errors.push({text:'Password do not match'});
    }
    if(password.length < 4){
        errors.push({text:'Password must be least 4 characters'})
    }
    if(errors.length > 0){
        res.render('users/signup',{errors,name,email,password,confirm_password})
    }else{
        const emailUser = await User.findOne({email:email});
        if(emailUser){
            req.flash('error_msg','The Email is already in use');
            res.redirect('/users/signup')
        }else{
            const newUser = new User({name, email, password});
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash('success_msg','You are registered');
            res.redirect('/users/signin');
        }
    }

    
})

router.get('/users/logout',(req,res)=>{
    req.logout();
    res.redirect('/');
})

module.exports = router;