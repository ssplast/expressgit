var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('bugaltery/window', {title: 'бугалтерия'});
});

module.exports = router;