const express = require('express'),
    passport = require('passport'),
    router = express.Router(),
    { dbUser } = require('../dbModels/user'),
    { dbVideo } = require('../dbModels/video'),
    subscription = require('../dbModels/subscription'),
    Modals = require('../dbModels/playlist');

router.get('/:id', async (req, res, next) => {

    try {
        if (!req.user) {
            res.redirect('/');
        } else {
            //id = req.body.id;
            id = req.params.id;
            let dbuser = await dbUser.findOne({ email: id });
            let isSubbed = await subscription.findOne({ subsFrom: req.user._id, subsTo: dbuser._id });
            let subsCount = await subscription.find({ subsTo: dbuser._id }).count();
            let publicAccess = !(dbuser._id == req.user._id);
            let private = "NOT PRIVATE";
            if (!publicAccess) private = "Private";
            console.log("am i subbed? "+isSubbed + " subbed count :"+ subsCount);
            //console.log("trying to get playlist as public::"+publicAccess);
            let playlists = await Modals.playlist.find(
                {
                    authorId: dbuser._id,
                    $or: [{ privacy: "Public" }, { privacy: private }]
                }
            );
            if (!dbuser) {
                res.render('profile.ejs', { user: req.user, videos: [], userProfile: null, isSubbed: isSubbed, subsCount: subsCount ,playlists: playlists});
            } else {
                let videos = await dbVideo.find({ uploader: id });
                console.log(videos);
                res.render('profile.ejs', { user: req.user, videos: videos, userProfile: dbuser, isSubbed: isSubbed, subsCount: subsCount,playlists: playlists });
            }
        }
    }
    catch (ex) {
        console.log(ex.message);
    }
});

module.exports = router;
