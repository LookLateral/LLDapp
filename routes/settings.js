var express = require('express');

var router = express.Router();

/* GET Settings page. */
router.get('/', function (req, res, next) {
    if (req.session.memberData) {
        res.render('settings', { title: 'Look Lateral Test Settings', MemberData: req.session.memberData });
    } else {
        res.redirect('/login');
    }
});

module.exports = router;