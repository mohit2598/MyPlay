const express = require('express'),
    router = express.Router(),
    Admin = require('../controllers/admin'),
    {AdminRequest,validate} = require('../dbModels/adminRequest'),
    {dbVideo} = require('../dbModels/video'),
    getSearchResults = require('../static/js/getSearchResults')      

router.get('/:id',async (req,res,next)=>{
    let video = await dbVideo.findOne({id : req.params.id});
    if(!video){
        res.status('404').send("NO valid request");
    }else{
        let title = video.title;
        let videos = await getSearchResults(title);
        res.render('play.ejs',{videos : videos,video : video,user : req.user});
    }
    
    // res.send("hello");
});


module.exports = router;