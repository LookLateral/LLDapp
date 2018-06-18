var express = require('express');
var router = express.Router();

/* GET Art Detail page. */
router.get('/', function (req, res, next) {
    if (req.session.memberData) {
        res.render('art-detail-buy', { title: 'Look Lateral Test Art Buy', MemberData: req.session.memberData });
    } else {
        res.redirect('/login');
    }
});

module.exports = router;