const express = require('express'),
    passport = require('passport'),
    router = express.Router()

router.get('/',async (req,res,next) =>{
    
    try{       
         res.render('home.ejs');
        //res.send(");
        //res.send(req.user);
        // res.render("home.ejs",{user:req.user,ques:list,isHome:true,title:'home'})        
    }
    catch(ex){
        console.log(ex.message);
    }
});

module.exports = router;
