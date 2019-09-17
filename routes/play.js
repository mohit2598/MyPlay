const express = require('express'),
    router = express.Router(),
    Admin = require('../controllers/admin'),
    { AdminRequest, validate } = require('../dbModels/adminRequest'),
    { dbVideo } = require('../dbModels/video'),
    getSearchResults = require('../static/js/getSearchResults'),
    mongoose = require('mongoose')

router.get('/:id', async (req, res, next) => {
    if(!req.user){
         res.redirect('/');;
    }
    try {
        let video = await dbVideo.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
        console.log( req.params.id);
        if (!video) {
            res.status('404').send("Not a valid request");
        } else {
            let title = video.title;
            let videos = await getSearchResults(title);
            res.render('play.ejs', { videos: videos, video: video, user: req.user });
        }
    } catch (err) {
        console.log(err);
        res.send(err);
    }

    // res.send("hello");
});


module.exports = router;