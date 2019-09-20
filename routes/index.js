const express = require('express'),
    passport = require('passport'),
    router = express.Router(),
    trending = require('../dbModels/trending.js'),
    videoModel = require('../dbModels/video');

router.get('/',async (req,res,next) =>{
    if(!req.user) res.end("Not signed in");
    try{
        let trendingVideos = await trending.find({});
        trendingVideos = await videoModel.dbVideo.populate(trendingVideos , { path: 'videoId' , model : 'Video'});
        trendingVideos.sort((a,b)=>{
            if(a.rank > b.rank ) return 1;
            return -1;
        });
        res.render('index.ejs',{ user: req.user, trendingVideos : trendingVideos });
    }
    catch(err){
        console.log("Some error occured in trending post handler."+err);
    }
});

module.exports = router;
