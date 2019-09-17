const express = require('express'),
    passport = require('passport'),
    router = express.Router()

router.get('/',async (req,res,next) =>{
    
    try{       
        //res.render('index.ejs',{user : null})
        if(req.user){
            res.render('index.ejs',{user  : req.user});
        }else{
            res.render('home1.ejs',{user : null})
        }
       // res.render('play.ejs',{user : null,videos : null})
        //res.send(");
        //res.send(req.user);
        // res.render("home.ejs",{user:req.user,ques:list,isHome:true,title:'home'})        
    }
    catch(ex){
        console.log(ex.message);
    }
});

module.exports = router;
