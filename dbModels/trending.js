const mongoose = require('mongoose');
const Schema = mongoose.Schema ;
 
let trendingSchema = new Schema({
    videoId : String ,
    rank : Number
});

let trending = new mongoose.model('trending',trendingSchema);

module.exports = trending ;