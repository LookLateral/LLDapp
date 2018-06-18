/* Test POST to Taurus API for account create. */

var countries = require('country-list')();
var express = require('express');
var rp = require('request-promise');

// Load the environment config
var environmentConfig = require('../environment.json');

var router = express.Router();

router.post('/register-post', function (req, res, next) {
    var options = {
        method: 'POST',
        uri: environmentConfig.ApiServer + '/member/register',
        body: {
            firstname: req.body.first_name,
            lastname: req.body.last_name,
            country: req.body.country,
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
            // POST succeeded...
            if (req.session.memberData) {
                req.session.destroy();
            }
            req.session.memberData = memberData;

            res.redirect('/member-dashboard')
        })
        .catch(function (err) {
            // POST failed...
            var errorText = (typeof err.error !== 'undefined' && typeof err.error.Error !== 'undefined' ? err.error.Error : 'We were unable to register you -- please try again later');

            res.render('register',
                {
                    title: 'Look Lateral Test Create Account',
                    MemberData: null,
                    ErrorText: errorText,
                    Email: req.body.email,
                    FirstName: req.body.first_name,
                    LastName: req.body.last_name,
                    Country: req.body.country,
                    Countries: countries.getNames()
                });
        });
});

module.exports = router;
