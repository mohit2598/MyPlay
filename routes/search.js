const express = require('express'),
    router = express.Router(),
    getSearchResult = require('../static/js/getSearchResults.js'),
    moment = require('moment')

router.get('/query/:q',async function(req, res) {
    query = req.params.q;
   // console.log(query);
    var list = await getSearchResult(query);
    console.log(list);
    res.render('searchResults.ejs',{list : list,moment : moment});
})

module.exports = router;