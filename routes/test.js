var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('test/test_bottons_style', {title: 'тестовая страница'});
});

module.exports = router;

