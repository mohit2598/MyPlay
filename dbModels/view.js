/*jslint es6:true*/
const mongoose = require('mongoose'),
    Joi = require('joi');  //for validating

mongoose.set('useCreateIndex', true);

const viewSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true
    },
    videoId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    expiresAt: { type: Date, expires: '5m', default: Date.now }
}, { timestamps: true, versionKey: false, strict: false });

viewSchema.index({ expiresAt: 1 }, { expireAfterSeconds : 1000 });


const View = mongoose.model('View', viewSchema);  // 1st arg is the singular object in database 2nd is Schema


exports.dbView = View;

