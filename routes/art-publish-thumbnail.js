var express = require('express');
var flash = require('connect-flash');

var router = express.Router();

/* POST Art thumbnail */
router.get('/', function (req, res, next) {
    if (req.session.memberData) {
        res.render('art-publish-thumbnail', { title: 'Look Lateral Test Art Publish Thumbnail', ErrorText: req.flash('error'), MemberData: req.session.memberData });
    } else {
        res.redirect('/login');
    }
});

module.exports = router;