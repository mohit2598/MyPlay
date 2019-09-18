const Joi = require('joi'),  //for validating
    jwt = require('jsonwebtoken'),
    config = require('config'),
    mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs'),
    moment = require('moment'),
    { dbVideo, validate } = require('../dbModels/video'),
    { dbReports } = require('../dbModels/reports')


var reportedAbuse = async function (req, res, next) {

    var validrequest;
   
    try {
        var requests ;
        validrequest = await dbReports.find();
        let fullReport = await dbVideo.populate(validrequest , { path : 'videoId' , model : 'Video' });
    
        res.render("adminPanel.ejs", {requests : fullReport, moment : moment});
    } catch (exep) {
        console.log(exep);
    }
   console.log(requests);
    
    next();
}


module.exports = { reportedAbuse : reportedAbuse };



