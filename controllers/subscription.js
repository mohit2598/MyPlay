const notification = require('../dbModels/notification');
const subscription = require('../dbModels/subscription');
const { dbUser } = require('../dbModels/user');

async function createNotif(user, video , notifType='default'){ //add video,user agrument
    try{
        
        if(notifType=='default'){
            let userToNotify = await subscription.find({subsTo:user._id},'subsFrom');
             notifType='new video uploaded';
             userToNotify.forEach(async function(toUser){
                let newNotif = new notification({
                    notifType : notifType,
                    fromUserId : user._id,
                    toUserId : toUser.subsFrom,
                    fromName : user.name,
                    link : video._id
                });
                await newNotif.save();
              //  console.log("this user is notified:"+toUser);
            });
        }
        else{ 
            //console.log(user);
            let userId = await dbUser.findOne({email: user });
             notifType = 'admin removed video';
            // console.log('removing video ');
            // console.log(userId);
             let newNotif = new notification({
                notifType : notifType,
                fromUserId : "admin",
                toUserId : userId._id,
                fromName : "admin",
                link : video.title
            });
            await newNotif.save();
           // console.log("this user is notified for deletion:"+user);
        }
       // console.log("new notif req");
        
    }
    catch(err){
        console.log("some error occured while creating notif." + err);
    }

}

async function showAllSubs(user){
    try{
        let allSubs = await subscription.find({ subsFrom: user._id });
        let completeInfo = await dbUser.populate(allSubs, { path: 'subsTo' , select: 'name _id username', model: 'User'});
        return completeInfo ;    
    }catch(err){
        throw err;
    }
}


module.exports = {createNotif: createNotif, showAllSubs : showAllSubs} ;

