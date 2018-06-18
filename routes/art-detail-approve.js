var express = require('express');
var functions = require('../functions.js');
var rp = require('request-promise');

// Load the environment config
var environmentConfig = require('../environment.json');

var router = express.Router();

/* GET for artwork approval */
router.get('/', function (req, res, next) {
    if (req.session.memberData) {
        if (req.query.artworkId) {
            var artworkId = req.query.artworkId;

            var options = {
                method: 'GET',
                uri: environmentConfig.ApiServer + '/artwork/' + artworkId + '/approve',
                headers: {
                    'User-Agent': 'Request-Promise',
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + req.session.memberData.Token
                },
                json: true // Automatically stringifies the body to JSON
            };

            rp(options)
                .then(function () {
                    res.redirect('/art-detail?artworkId=' + artworkId);
                })
                .catch(function (err) {
                    // GET failed...
                    console.log(err);
                    res.redirect(functions.redirectWithError(req, err.error.Error));
                });
        } else {
            res.redirect(functions.redirectWithError(req, 'Missing or invalid artwork id'));
        }
    } else {
        res.redirect('/login');
    }
});

module.exports = router;