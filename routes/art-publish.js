var express = require('express');
var flash = require('connect-flash');
var router = express.Router();

/* GET Art Detail page. */
router.get('/', function (req, res, next) {
    if (req.session.memberData) {
        if (req.query.galleryId) {
            res.render('art-publish', { title: 'Look Lateral Test Art Publish', ErrorText: req.flash('error'), MemberData: req.session.memberData, Gallery: req.query.galleryId });
        } else {
            res.redirect('/gallery-dashboard');
        }
    } else {
        res.redirect('/login');
    }
});

module.exports = router;