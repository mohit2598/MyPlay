
const { dbLike } = require('../dbModels/like'),
    { dbDislike } = require('../dbModels/dislike'),
    { dbComment } = require('../dbModels/comment'),
    { dbVideo, validate } = require('../dbModels/video'),
    mongoose = require('mongoose')

//this is to remove the comment
//this is for adding comment on video
var removeComment = async function (req, res, next) {
    //res.send("hello");
    if (!req.user) {
        res.status(403).send('Unauthorized access');
    }

    try {
        let result = await dbComment.findOneAndRemove({ userEmail: req.user.email, _id: req.body.commentId });
        res.send('1');
    } catch (ex) {
        console.log("Error in remove comment " + ex);
        res.status(500).send('Internal Server Error');
    }

    next();
}
//this is for adding comment on video
var addComment = async function (req, res, next) {
    if (!req.user) {
        res.status(400).send('Unauthorized');
    } else {
        try {
            console.log(req.body.content);
            const dbcomment = new dbComment(
                {
                    "userEmail": req.user.email,
                    "videoId": req.body.videoId,
                    "content": req.body.content,
                    "commenterName": req.user.name
                });
            const result = await dbcomment.save();
            if (result)
                res.send("1");
            else
                res.send("-1");
        } catch (ex) {
            res.status(500).send('Server Error ' + ex);
        }
    }
    next();
}


//this is to save the comment you have edited
var saveComment = async function (req, res, next) {

    console.log(req.body.content);

    var result = await Comment.findOneAndUpdate({
        "_id": req.body.commentId,
    },
        {
            $set: { "content": req.body.content }
        });

    if (result)
        res.send("1")
    else
        res.send("-1");

    next();
}

//this is for checking if user can comment on video
var editComment = async function (req, res, next) {

    var validcomment;
    try {
        var result = await dbComment.findOneAndUpdate({
            "_id": req.body.commentId,
            "userEmail": req.user.email
        },
            {
                $set: { "content": req.body.content }
            });
        res.send('1');
    } catch (exep) {
        res.status(400).send("Unautorized access ");
        console.log(exep);
    }



    next();
}



//this is for checking if user can edit the name and description of  video
var editVideo = async function (req, res, next) {

    var validrequest;
    try {
        validrequest = await Video.findOne({
            $and: [
                { uploader: "shashanksharma7874@gmail.com" },
                { id: req.body.videoId }]
        });
    } catch (exep) {
        console.log(exep);
    }

    if (validrequest)
        res.send("1");
    else
        res.send("-1");

    next();
}

//this is to save the video you have edited name of
var saveVideo = async function (req, res, next) {

    var result = await Video.findOneAndUpdate({
        $and: [
            { uploader: "shashanksharma7874@gmail.com" },
            { id: req.body.videoId }]

    },
        {
            $set: {
                "name": req.body.videoName,
                "description": req.body.videoDescription
            }
        });

    if (result)
        res.send("1")
    else
        res.send("-1");

    next();
}


//this is functioning of dislike buton
var dislikeVideo = async function (req, res, next) {
    let video;
    if (req.body == null || req.body._id == null) {
        res.send({ code: -2 });
        res.end();
    }
    try {
        video = await dbVideo.findById(mongoose.Types.ObjectId(req.body._id));
        if (!video) {
            console.log('cnsdc');
            res.send({ code: -2 });
        } else if (!req.user) {
            console.log('cnsdc2');
            res.send({ code: -2 });
        }
    } catch (ex) {
        console.log('Error is here ' + ex);
        res.send({ code: -2 });
    }

    let noLikes = await dbLike.find({ userEmail: req.user.email, videoId: req.body._id }).count();
    let noDislikes = await dbDislike.find({ userEmail: req.user.email, videoId: req.body._id }).count();

    const dislike1 = new dbDislike({
        userEmail: req.user.email,
        videoId: req.body._id,

    });
    var dislikes;
    try {
        dislikes = await dbDislike.findOne({
            $and: [
                { userEmail: req.user.email },
                { videoId: req.body._id }]
        });
    } catch (exep) {
        console.log(exep);
        res.status(500).send('INternal server error ' + exep);
    }
    if (dislikes) {
        console.log("deleting record");
        try {
            await dbDislike.deleteMany({
                $and: [
                    { "userEmail": req.user.email },
                    { "videoId": mongoose.Types.ObjectId(req.body._id) }]
            });
        }
        catch (ex) {
            console.log(ex);
            res.status(500).send('INternal server error ' + ex);
        }

        res.send({ code: -1, likes: noLikes, dislikes: noDislikes - 1 });
    }
    else {
        try {
            const result = await dislike1.save();

            var check = await dbLike.deleteMany({
                $and: [
                    { "userEmail": req.user.email },
                    { "videoId": mongoose.Types.ObjectId(req.body._id) }]
            });
            console.log("bhai ab toh ho gya");
        } catch (exception) {
            console.log("error is coming see it " + exception);
            res.status(500).send('INternal server error ' + exception);
        }

        if (check.deletedCount != 0)
            res.send({ code: 1, likes: noLikes - 1, dislikes: noDislikes + 1 });
        else
            res.send({ code: 1, likes: noLikes, dislikes: noDislikes + 1 });
    }

    next();

}

//in this i want the id of current video playing 
var likeVideo = async function (req, res, next) {
    let video;
    if (req.body == null || req.body._id == null) {
        res.send({ code: -2 })
        res.end();
    }

    try {
        video = await dbVideo.findById(mongoose.Types.ObjectId(req.body._id));
        if (!video) {
            console.log('cnsdc');
            res.send({ code: -2 });
        } else if (!req.user) {
            console.log('cnsdc2');
            res.send({ code: -2 });
        }
    } catch (ex) {
        console.log('Error is here ' + ex);
        res.send("Erro is " + ex)
    }
    let noLikes = await dbLike.find({ userEmail: req.user.email, videoId: req.body._id }).count();
    let noDislikes = await dbDislike.find({ userEmail: req.user.email, videoId: req.body._id }).count();


    const like1 = new dbLike({
        videoId: req.body._id,
        userEmail: req.user.email
    });

    var likes;
    try {
        likes = await dbLike.findOne({
            $and: [
                { userEmail: req.user.email },
                { videoId: req.body._id }]
        });
    } catch (exep) {
        res.status(500).send('Internal server error ' + exep);
    }
    if (likes) {
        console.log("deleting record");
        try {
            await dbLike.deleteMany({
                $and: [
                    { "userEmail": req.user.email },
                    { "videoId": req.body._id }]
            });
            res.send({ code: -1, likes: noLikes - 1, dislikes: noDislikes });
        }
        catch (ex) {
            console.log(ex);
            res.status(500).send({ code: -2 });
        }

    } else {
        try {
            const result = await like1.save();
            var check = await dbDislike.deleteMany({
                $and: [
                    { "userEmail": req.user.email },
                    { "videoId": mongoose.Types.ObjectId(req.body._id) }]
            });
            console.log("bhai ab toh ho gya");
            if (check.deletedCount != 0)
                res.send({ code: 1, likes: noLikes + 1, dislikes: noDislikes - 1 });
            else
                res.send({ code: 1, likes: noLikes + 1, dislikes: noDislikes });
        } catch (exception) {
            console.log("error is coming see it" + exception);
            res.status(500).send({ code: -2 });
        }
    }

    next();

}

var getComment = async function (req, res, next) {
    if (!req.user) {
        res.redirect('/');
        res.end();
    } else {
        try {
            email = req.user.email;
            let comment = await dbComment.findOne({ _id: req.body.commentId, userEmail: req.user.email });
            if (!comment) {
                res.status(400).redirect('/');
            } else {
                res.send(comment.content);
                res.end();
            }
        } catch (ex) {
            console.log("Error in get comment ", ex);
        }
    }
}




//Do not forget to change them
module.exports = {
    editVideo: editVideo,
    saveVideo: saveVideo,
    saveComment: saveComment,
    editComment: editComment,
    removeComment: removeComment,
    addComment: addComment,
    likeVideo: likeVideo,
    dislikeVideo: dislikeVideo,
    getComment: getComment
};