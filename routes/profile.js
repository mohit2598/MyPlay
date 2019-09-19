const express = require('express'),
    passport = require('passport'),
    router = express.Router(),
    {dbUser} = require('../dbModels/user'),
    {dbVideo} = require('../dbModels/video');

router.get('/:id',async (req,res,next) =>{
    
    try{       
        if(!req.user){
             res.redirect('/');
        }else{
            //id = req.body.id;
            id = req.params.id;
            let dbuser = await dbUser.findOne({email : id});
            if(!dbuser){
                res.render('profile.ejs',{user : req.user,videos : [],userProfile : null});
            }else{
                let videos = await dbVideo.find({uploader : id});
                console.log(videos);
                res.render('profile.ejs',{user : req.user,videos : videos,userProfile : dbuser});
            }
        }       
    }
    catch(ex){
        console.log(ex.message);
    }
});

module.exports = router;
