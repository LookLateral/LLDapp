var express = require('express');
var flash = require('connect-flash');
var router = express.Router();

/* GET Art Publish Provenance page. */
router.get('/', function (req, res, next) {
    if (req.session.memberData) {
        res.render('art-publish-provenance', { title: 'Look Lateral Test Art Publish Provenance', ErrorText: req.flash('error'), MemberData: req.session.memberData });
    } else {
        res.redirect('/login');
    }
});

module.exports = router;