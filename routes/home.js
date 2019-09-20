const express = require('express'),
    passport = require('passport'),
    router = express.Router(),
    trending = require('../dbModels/trending.js'),
    videoModel = require('../dbModels/video');
router.get('/', async (req, res, next) => {

    try {
        //res.render('index.ejs',{user : null})
        if (req.user) {
            let trendingVideos = await trending.find({});
            trendingVideos = await videoModel.dbVideo.populate(trendingVideos, { path: 'videoId', model: 'Video' });
            trendingVideos.sort((a, b) => {
                if (a.rank > b.rank) return 1;
                return -1;
            });
            res.render('index.ejs', { user: req.user, trendingVideos: trendingVideos });
        } else {
            res.render('home1.ejs', { user: null })
        }
        // res.render('play.ejs',{user : null,videos : null})
        //res.send(");
        //res.send(req.user);
        // res.render("home.ejs",{user:req.user,ques:list,isHome:true,title:'home'})        
    }
    catch (ex) {
        console.log(ex.message);
    }
});

module.exports = router;
