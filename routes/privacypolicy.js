var express = require('express');
var router = express.Router();

/* GET privacy policy page. */
router.get('/', function (req, res, next) {
    var memberData = (req.session.memberData ? req.session.memberData : null);
    res.render('privacypolicy', { title: 'Look Lateral Test Privacy Policy', MemberData: memberData });
});

module.exports = router;
