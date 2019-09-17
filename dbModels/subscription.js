const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let subscriptionSchema = new Schema({
    subsTo : String ,
    subsFrom : String
});

const subscription  = mongoose.model('subscription', subscriptionSchema);

module.exports = subscription ;