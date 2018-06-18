var countries = require('country-list')();
var express = require('express');

var router = express.Router();

/* GET signin page. */
router.get('/', function (req, res, next) {
    res.render('register', { title: 'Look Lateral Test Create Account', MemberData: null, Countries: countries.getNames() });
});

module.exports = router;