var express = require('express');
var router = express.Router();

/* GET terms of service page. */
router.get('/', function (req, res, next) {
    var memberData = (req.session.memberData ? req.session.memberData : null);
    res.render('termsofservice', { title: 'Look Lateral Test Terms of Service', MemberData: memberData });
});

module.exports = router;
