var express = require('express');
var functions = require('../functions.js');
var rp = require('request-promise');

// Load the environment config
var environmentConfig = require('../environment.json');

var router = express.Router();

router.post('/art-delete-post', function (req, res, next) {
    if (req.session.memberData &&
        req.session.memberData.Role == 1) {
        var options = {
            method: 'POST',
            uri: environmentConfig.ApiServer + '/artwork/' + req.body.artworkId + '/delete',
            headers: {
                'User-Agent': 'Request-Promise',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + req.session.memberData.Token
            },
            json: true // Automatically stringifies the body to JSON
        };

        rp(options)
            .then(function (json) {
                // POST succeeded...
                res.redirect('/art-list');
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
