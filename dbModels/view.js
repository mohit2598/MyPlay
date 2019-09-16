/*jslint es6:true*/
const mongoose = require('mongoose'),
    Joi = require('joi')  //for validating

  
const viewSchema = new mongoose.Schema({
   userEmail : {
       type : String,
       required : true
   },
   videoId : {
       type : mongoose.Types.ObjectId,
       required : true
   },
   expireAt : {
       type : Date ,
       dafault : Date.now(),
       index : { expires : '5m'}
   }
});



const View = mongoose.model('View',viewSchema);  // 1st arg is the singular object in database 2nd is Schema

exports.dbView = View;

