/* Test POST to Taurus API for artwork metadata publish. */
var express = require('express');
var functions = require('../functions.js');
var rp = require('request-promise');

// Load the environment config
var environmentConfig = require('../environment.json');

var router = express.Router();

router.post('/art-publish-post', function (req, res, next) {
    if (req.session.memberData) {
        var options = {
            method: 'POST',
            uri: environmentConfig.ApiServer + '/artwork/upload',
            body: {
                title: req.body.artwork_title,
                description: req.body.artwork_description,
                artist: req.body.artwork_artist,
                courtesy: req.body.artwork_courtesy,
                medium: req.body.artwork_medium,
                workcreated: req.body.artwork_created,
                email: req.body.email,
                galleryID: req.body.galleryID
            },
            headers: {
                'User-Agent': 'Request-Promise',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + req.session.memberData.Token
            },
            json: true // Automatically stringifies the body to JSON
        };

        rp(options)
            .then(function (parsedBody) {
                // POST succeeded...
                res.redirect('/gallery-dashboard')
            })
            .catch(function (err) {
                // POST failed...
                console.log(err);
                res.redirect(functions.redirectWithError(req, err.error.Error));
            });
    } else {
        res.redirect('/login');
    }
});

module.exports = router;
