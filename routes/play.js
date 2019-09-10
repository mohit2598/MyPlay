const express = require('express'),
    router = express.Router(),
    Admin = require('../controllers/admin'),
    {AdminRequest,validate} = require('../dbModels/adminRequest')              

router.get('/:id',async (req,res,next)=>{
    var video = {
        id : req.params.id
    }
    res.render('play.ejs',{videos : video,user : req.user});
});


module.exports = router;