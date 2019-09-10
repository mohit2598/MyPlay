const express = require('express'),
    router = express.Router(),
    Admin = require('../controllers/admin'),
    {AdminRequest,validate} = require('../dbModels/adminRequest')              

router.get('/getrequest/:id',async (req,res,next)=>{
    if(!req.user.isAdmin){
        res.status(401).send('Unathorized access');
        res.end();
    }
    var page = req.params.id || 1;
    const perPage = 10;
    var option = {};
    if(req.query.type === 1 || req.query.type === 2){
        option['type'] = req.query.type ; 
    }
    AdminRequest
        .find({option})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, requests) {
            AdminRequest.count().exec(function(err, count) {
                if (err) return next(err)
                res.render('request.ejs', {
                    requests: requests,
                    current: page,
                    pages: Math.ceil(count / perPage)
                })
            })
        })
});


module.exports = router;