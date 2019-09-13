const mongoose = require('mongoose'),
    Joi = require('joi'),  //for validating
    jwt = require('jsonwebtoken'),
    config = require('config'),
    bcrypt = require('bcrypt-nodejs')
  
var ObjectId=mongoose.Schema.ObjectId;

const likeSchema = new mongoose.Schema({
    
    userEmail:{
        type:String,
    },
    videoId:{
        type:ObjectId,
    },             
});
 

var Like = mongoose.model('Like',likeSchema);  // 1st arg is the singular object in database 2nd is Schema




module.exports.dbLike = Like;



