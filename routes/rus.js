var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('rus/index', { title: 'RUS' });
});

module.exports = router;
