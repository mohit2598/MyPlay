const express = require('express');
const AdminPanel = require('../controllers/adminPanel');
var router = express.Router();

router.get('/',AdminPanel.reportedAbuse);


module.exports = router;
