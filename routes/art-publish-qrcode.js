var express = require('express');
var flash = require('connect-flash');

var router = express.Router();

/* POST Art QR Code */
router.get('/', function (req, res, next) {
    if (req.session.memberData) {
        res.render('art-publish-qrcode', { title: 'Look Lateral Test Art Publish QR Code', ErrorText: req.flash('error'), MemberData: req.session.memberData });
    } else {
        res.redirect('/login');
    }
});

module.exports = router;