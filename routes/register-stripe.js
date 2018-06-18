var express = require('express');
var router = express.Router();

/* GET register with Stripe page. */
router.get('/', function (req, res, next) {
    var countries = ['United States', 'Italy', 'Vietnam'];
    res.render('register-stripe', { title: 'Look Lateral Test Create Account with Stripe', MemberData: null, Countries: countries });
});

module.exports = router;