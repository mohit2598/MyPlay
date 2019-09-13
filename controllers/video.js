
const { dbLike } = require('../dbModels/like'),
    { dbDislike } = require('../dbModels/dislike'),
    { dbComment} = require('../dbModels/comment'),
    { dbVideo, validate } = require('../dbModels/video'),
    mongoose = require('mongoose')

//this is to remove the comment
//this is for adding comment on video
var removeComment = async function (req, res, next) {


    const result = await Comment.findByIdAndRemove(req.body.commentId);
    if (result)
        res.send("1");
    else
        res.send("-1");

    next();
}
//this is for adding comment on video
var addComment = async function (req, res, next) {
    if (!req.user) {
        res.status(400).send('Unauthorized');
    } else {
        try{
            console.log(req.body.content);
        const dbcomment = new dbComment(
            {
                "userEmail": req.user.email,
                "videoId": req.body.videoId,
                "content": req.body.content,
            });
        const result = await dbcomment.save();
        if (result)
            res.send("1");
        else
            res.send("-1");
        }catch(ex){
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
        validcomment = await Comment.findOne({
            $and: [
                { userEmail: "shashanksharma7874@gmail.com" },
                { _id: req.body.commentId }]
        });
    } catch (exep) {
        console.log(exep);
    }

    if (validcomment)
        res.send("1");
    else
        res.send("-1");

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
        res.send("Erroe");
        res.end();
    }
    try {
        video = await dbVideo.findById(mongoose.Types.ObjectId(req.body._id));
        if (!video) {
            console.log('cnsdc');
            res.send('1');
        } else if (!req.user) {
            console.log('cnsdc2');
            res.send('2');
        }
    } catch (ex) {
        console.log('Error is here ' + ex);
        res.send("Erro is " + ex)
    }

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

        res.send("-1");
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
            res.send("0")
        else
            res.send("1");
    }

    next();

}

//in this i want the id of current video playing 
var likeVideo = async function (req, res, next) {
    let video;
    if (req.body == null || req.body._id == null) {
        res.send("Erroe");
        res.end();
    }
    try {
        video = await dbVideo.findById(mongoose.Types.ObjectId(req.body._id));
        if (!video) {
            console.log('cnsdc');
            res.send('1');
        } else if (!req.user) {
            console.log('cnsdc2');
            res.send('2');
        }
    } catch (ex) {
        console.log('Error is here ' + ex);
        res.send("Erro is " + ex)
    }

    console.log(req.user)
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
            res.send("-1");
        }
        catch (ex) {
            console.log(ex);
            res.status(500).send('Internal server error ' + ex);
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
                res.send("0");
            else
                res.send("1");
        } catch (exception) {
            console.log("error is coming see it" + exception);
            res.status(500).send('INternal server error ' + exception);
        }

    }

    next();

}





//Do not forget to change them
module.exports = { editVideo: editVideo, saveVideo: saveVideo, saveComment: saveComment, editComment: editComment, removeComment: removeComment, addComment: addComment, likeVideo: likeVideo, dislikeVideo: dislikeVideo };