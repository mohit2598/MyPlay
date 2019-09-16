/*jslint es6:true*/
const mongoose = require('mongoose'),
    Joi = require('joi'),  //for validating
    jwt = require('jsonwebtoken'),
    config = require('config'),
    bcrypt = require('bcrypt-nodejs')
  
const videoSchema = new mongoose.Schema({
    title :{type: String ,
        required: true ,
        minlength:5,
        maxlength:250,
        lowercase:true
    },
    description:{type: String,
        required: true,
        minlength:5,
        maxlength:2000,

        lowercase:true
    },
    uploadTime:{type: Date,
        default : Date.now()   //this will automatically add date into this field
    },
    //likes:{type:[{ type : ObjectId }],  }, not sure of syntax
    likes:{
        type:Number,
        default:0
    },
    dislikes:{
        type:Number,
        default:0
    },
    uploader:{
        type:String,
        required : true
    },
    uploaderName : {
        type : String,
        required : true
    },
    /*comments:{
        type:[{type:ObjectId}],
    },*/
    url:{
        type:String,
    },
    //this will be added to find the duplicacy
    //hash:{
    //    type:string,
    //},
    isPrivate:{
        type:Boolean,
        default:false,
    },             
    id:{
        type : String,
        required : true
    },
    thumbnailName : {
        type : String,
        required : true
    },
    hash:{
        type : String,
        required : true
    },
    tags : {
        type : Array,
    },
    genre :{
        type : String,
    },
    views : {
        type : Number,
        default : 0
    }
});



const Video = mongoose.model('Video',videoSchema);  // 1st arg is the singular object in database 2nd is Schema


function validate(video){
    const schema = {
        title : Joi.string().min(5).max(250).required(),
        description: Joi.string().min(5).max(2000).required(),
        uploader : Joi.string().min(5).max(200).required(),
        id : Joi.string().min(5).max(200).required(),
        hash : Joi.string().min(32).max(32).required(),
        genre : Joi.string().min(5).max(35).required(),
        tags : Joi.array(),
        isPrivate : Joi.bool(),
        thumbnailName : Joi.string().min(5).max(200).required(),
        uploaderName : Joi.string().min(5).max(200).required()
    };
    return Joi.validate(video,schema);
}


//these comment are to be reviewed ignore them
//User.prototype.signup = signup;
// User.prototype.validate = validate;

//module.exports = User;
exports.dbVideo = Video;
exports.validate = validate;
