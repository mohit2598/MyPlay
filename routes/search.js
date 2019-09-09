const express = require('express'),
    router = express.Router()

router.get('/query/:q', function(req, res) {
    query = req.params.q;
    
})

module.exports = router;