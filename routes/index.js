var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    var memberData = (req.session.memberData ? req.session.memberData : null);

    if (memberData == null) {
        res.render('index', { title: 'Look Lateral Test', MemberData: memberData });
    } else {
        res.redirect('/member-dashboard');
    }
});

module.exports = router;
