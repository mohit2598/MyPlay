const express = require('express');
const router = express.Router();
const VideosModal = require("../dbModels/video.js");
const trending = require('../dbModels/trending.js');


router.post('/trending',async function(req,res){
    try{
        let trendingVideos = await trending.find({});
        trendingVideos.sort((a,b)=>{
            if(a.rank < b.rank ) return 1;
            return -1;
        });
        res.writeHead({'Content-Type': 'application/json'});
        res.write(JSON.stringify(trendingVideos));
        res.end();
    }
    catch(err){
        console.log("Some error occured in trending post handler."+err);
    }
});

async function updateTrending(){
    try {
        let videos = await VideosModal.dbVideo.find({}, 'views uploadTime');
        videos.sort((a, b) => {
            let tf1 = a.views / (Date.now() - Date.parse(a.uploadTime));
            let tf2 = b.views / (Date.now() - Date.parse(b.uploadTime));
            if (tf1 >= tf2) return -1;
            return 1;
        });
        
        await trending.deleteMany({});
       // videos = Array.prototype.splice.call(videos);
        //console.log(videos);
        for (let i = 0; i < 13 && i< videos.length; i++) {

            let newTrending = new trending({
                videoId: videos[i]._id,
                rank: i+1
            });
            await newTrending.save();
        }
        console.log("just updated trending videos");
    }
    catch (err) {
        console.log("some error occured in updateTrending function."+err);
    }
}
updateTrending();

setInterval(updateTrending,3600000);  //update every hour

module.exports = router;