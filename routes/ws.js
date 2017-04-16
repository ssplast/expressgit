var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('ws/index', {
        domain: g.domain + ':' + g.port,
        title: 'ws'
    });
});

module.exports = router;
