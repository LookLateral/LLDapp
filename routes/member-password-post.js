/* POST to Taurus API to change password. */
var express = require('express');
var functions = require('../functions.js');
var rp = require('request-promise');

// Load the environment config
var environmentConfig = require('../environment.json');

var router = express.Router();

router.post('/member-password-post', function (req, res, next) {
    if (req.session.memberData) {
        var options = {
            method: 'POST',
            uri: environmentConfig.ApiServer + '/member/' + req.session.memberData.Id + '/password',
            body: {
                password: req.body.password
            },
            headers: {
                'User-Agent': 'Request-Promise',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + req.session.memberData.Token
            },
            json: true // Automatically stringifies the body to JSON
        };

        rp(options)
            .then(function (memberData) {
                // POST succeeded...
                res.redirect('/settings');
            })
            .catch(function (err) {
                var errorText = (typeof err.error !== 'undefined' && typeof err.error.Error !== 'undefined' ? err.error.Error : 'We were unable to change your password');
                res.render('settings', { title: 'Look Lateral Test Settings', MemberData: req.session.memberData, ErrorText: errorText });
            });
    } else {
        res.redirect('/login');
    }
});

module.exports = router;