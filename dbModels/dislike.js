const mongoose = require('mongoose'),
    Joi = require('joi')//for validating

var ObjectId = mongoose.Schema.Types.ObjectId;

const dislikeSchema = new mongoose.Schema({

    userEmail: {
        type: String,
    },
    videoId: {
        type: ObjectId,
    }
});

const Dislike = mongoose.model('Dislike', dislikeSchema);

module.exports.dbDislike = Dislike;