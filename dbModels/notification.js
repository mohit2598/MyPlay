const mongoose = require('mongoose');
const Schema = mongoose.Schema ;

const notificationSchema = new Schema({
    notifType : String ,
    notifTime : { type : Date , default : Date.now() },
    fromUserId : String ,
    toUserId : String,
    fromName : String,
    link : String ,
    isRead :{type: Boolean , default:false }
});

const notification = mongoose.model('notification', notificationSchema);

module.exports = notification ;