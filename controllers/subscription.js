const notification = require('../dbModels/notification');
const subscription = require('../dbModels/subscription');
const { dbUser } = require('../dbModels/user');

async function createNotif(user, video ){ //add video,user agrument
    let userToNotify = await subscription.find({subsTo:user._id},'subsFrom');
    userToNotify.forEach(async function(toUser){
        let newNotif = new notification({
            notifType : "New video Uploaded.",
            fromUserId : user._id,
            toUserId : toUser.subsFrom,
            fromName : user.name,
            link : video._id
        });
        await newNotif.save();
    });

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

