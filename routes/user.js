const express = require('express');
const passport = require('passport');
const User = require('../controllers/user');
var router = express.Router();


router.get('/login/google',User.loginGoogle);
router.get('/login/google/callback',User.loginGoogleCallback);
//router.post('/login',User.login);
router.post('/login',(req,res,next) =>{
    passport.authenticate('local',function(err,user,info){
        if(user){
            req.login(user,(err) =>{
                console.log('fuck hell');
                res.send(req.user);
            })
           
        }else{
             res.send('fail');
        }
    })(req,res,next);
})
router.post("/signup", User.signup);

//router.get("/editProfile",User.editProfile);

router.get('/logout',User.logout);


module.exports = router;
