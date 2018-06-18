var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    var memberData = (req.session.memberData ? req.session.memberData : null);
    res.render('how-it-works', { title: 'Look Lateral Test How it Works', MemberData: memberData });
});

module.exports = router;
