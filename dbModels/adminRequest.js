const mongoose = require('mongoose'),
    Joi = require('joi')  //for validating
  
const adminRequestSchema = new mongoose.Schema({
    type_id:{type: String ,
        required: true ,
    },
    uploader_id:{
        type:String,
        required : true,
    },
    type :{
        type :Number,
        require : true
    },
    requester_id:{type: String ,
        required: true,
        trim:true,  //to remove paddings
    },
    time :{
        type : Date,
        default : Date.now()
    }               
});



const AdminRequest = mongoose.model('AdminRequest',adminRequestSchema);  // 1st arg is the singular object in database 2nd is Schema

function validate(request){
    const schema = {
        type_id         : Joi.string().min(5).max(100).required(),
        type            : Joi.number().min(1).max(1).required(),
        requester_id    : Joi.string().min(5).max(100).required(),
        uploader_id     : Joi.string().min(5).max(100).required()
    };
    return Joi.validate(request,schema);
}



//User.prototype.signup = signup;
// User.prototype.validate = validate;

//module.exports = User;
exports.dbAdminRequest = AdminRequest;
exports.validate = validate;
