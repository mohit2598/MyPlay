const express = require('express');
const router = express.Router() ;
const subscription = require('../dbModels/subscription.js');
const {dbUser} = require('../dbModels/user');
const notification = require('../dbModels/notification');
const { createNotif }  = require('../controllers/subscription');

router.get('/',function(req,res){
   // let temp = showAllSubs(req.user);
   // temp.then(function(obj){
        //console.log("this is the return value::"+ obj);
        // console.log("reached");
        // for(let i=0;i<10;i++) createNotif();
         res.render('subscribe.ejs', {user : req.user, subscription : {subsTo : {name: "temp"}}, playlist: {hello:"hello"}});
  //  });    
});

router.post('/getNotifs',async function(req,res){
    if(!req.user){
        res.send(404);
    }
    else{
        let notifs = await notification.find({
           toUserId : req.user._id
        }).sort('notifTime').limit(10);
        res.writeHead(200,{'Content-Type':'application/json'});
        res.write(JSON.stringify(notifs));
        res.end();
    }
});

router.post('/markRead',async function(req,res){
    if(req.user){
        if(req.body){
            let howMany = req.body.howMany ;
            if(howMany=="one"){
                let nid = req.body.notifId;
                let notif = await notification.findById(nid);
                notif.isRead = true;
                await notif.save();
                res.send("done");
            }
            else{
                let notif = await notification.find({
                    toUserId : req.user._id
                });
                notif.forEach(async (item)=>{
                    item.isRead = true;
                    await item.save();
                });
                res.send("done");
            }
        }
        else{
            req.send("no req body");
        }
    }
    else{
        req.send("Not signed in.");
    }
});


router.get('/getAllSubs/:userId',async function(req,res){
    try{
        let userId = req.params.userId ; 
        //console.log(subscription);
        let allSubs = await subscription.find({ subsFrom: userId });
        //console.log("this is allsubs"+allSubs);
        let completeInfo = await dbUser.populate(allSubs, { path: 'subsTo' , select: 'name _id username', model: 'User'});
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(completeInfo));
        res.end();
       // return completeInfo ;
       //return allSubs ;
       
    }catch(err){
        throw err;
    }
});

router.post('/hsr/:userId',async function(req,res){  // hre=> handle subscription request
    if(!req.body) res.end("No request body");
    let subsToUserId = req.params.userId ;
    let subsOfUserId = req.user._id ;
    let action = req.body.action ;
    if(action=="add"){
        try{
            let newSubs = new subscription({
                subsTo : subsToUserId ,
                subsFrom : subsOfUserId
            });
            await newSubs.save();
            console.log("added success");
        }catch(err){
            res.status(400).send("Some error occurred");
            throw err;
        }
        res.send("add success");
    }
    else{
        try{
            await Modals.subscription.findOneAndDelete({ subsTo: subsToUserId , subsFrom : subsOfUserId },
                function(err){
                    if(err) throw err;
                    console.log("deleted Subscription.");
                });
            
        }catch(err){
            res.status(400).send("Some error occurred");
            throw err;
        }
        res.send("deleted success");
    }
});


module.exports = router ;