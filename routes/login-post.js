/* Test POST to Taurus API for login. */

var express = require('express');
var rp = require('request-promise');

// Load the environment config
var environmentConfig = require('../environment.json');

var router = express.Router();

router.post('/login-post', function (req, res, next) {
    var options = {
        method: 'POST',
        uri: environmentConfig.ApiServer + '/member/login',
        body: {
            email: req.body.email,
            password: req.body.password
        },
        headers: {
            'User-Agent': 'Request-Promise',
            'Content-Type': 'application/json'
        },
        json: true // Automatically stringifies the body to JSON
    };

    rp(options)
        .then(function (memberData) {
            switch (memberData.Status) {
                case 1:     // Active
                    // POST succeeded...
                    if (req.session.memberData) {
                        req.session.destroy();
                    }
                    req.session.memberData = memberData;

                    if (memberData.OwnedGalleries) {
                        res.redirect('/gallery-dashboard');
                    } else {
                        res.redirect('/member-dashboard');
                    }
                    break;

                case 2:     // Blocked
                case 3:     // Suspended
                    var accountLock = (memberData.Status == 2 ? 'disabled' : 'suspended');
                    res.render('login', { title: 'Look Lateral Test Login', MemberData: null, ErrorText: 'Your account has been ' + accountLock + ' -- please contact customer support.', Email: req.body.email });
                    break;

                default:    // Unknown
                    res.render('login', { title: 'Look Lateral Test Login', MemberData: null, ErrorText: 'We were unable to log you on -- please try again later.', Email: req.body.email });
                    break;
            }
        })
        .catch(function (err) {
            var errorText = (typeof err.error !== 'undefined' && typeof err.error.Error !== 'undefined' ? err.error.Error : 'We were unable to log you on -- please try again later');
            res.render('login', { title: 'Look Lateral Test Login', MemberData: null, ErrorText: errorText, Email: req.body.email });
        });
});

module.exports = router;