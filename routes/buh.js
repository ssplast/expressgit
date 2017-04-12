var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('buh/general', {title: 'бугалтерия'});
});

module.exports = router;