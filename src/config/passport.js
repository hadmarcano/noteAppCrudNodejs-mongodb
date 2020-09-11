const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/Users');

passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    const user = await User.findOne({email:email});
    if(!user){
        return done(null, false, {message:'Not User Found.'});
    }else{
        const match = await user.matchPassword(password);
        if(match){
            return done(null,user);
        }else{
            return done(null,false,{message:'Incorrect Password'});
        }
    }
}));

passport.serializeUser((user,done)=>{
    done(null,user.id)
});

passport.deserializeUser(async (id,done)=>{
    await User.findById(id,(err,user)=>{
        done(err,user);
    });
});