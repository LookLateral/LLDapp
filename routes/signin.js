var express = require('express');
var router = express.Router();


/* GET signin page. */
router.get('/', function(req, res, next) {
  res.render('signin', { title: 'Look Lateral Test Signin', MemberData: null });
});

module.exports = router;