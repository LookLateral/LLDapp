var express = require('express');
var functions = require('../functions.js');
var rp = require('request-promise');

// Load the environment config
var environmentConfig = require('../environment.json');

var router = express.Router();

router.get('/', function (req, res, next) {
    if (req.session.memberData) {
        if (req.session.memberData.Role == 1) {
            if (req.query.artworkId) {
                var artworkId = req.query.artworkId;

                var options = {
                    method: 'GET',
                    uri: environmentConfig.ApiServer + '/artwork/' + artworkId,
                    headers: {
                        'User-Agent': 'Request-Promise',
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic ' + req.session.memberData.Token
                    },
                    json: true // Automatically stringifies the body to JSON
                };

                rp(options)
                    .then(function (artworkData) {
                        res.render('art-detail-edit',
                            {
                                title: 'Look Lateral Test Edit Art',
                                Artwork: artworkData,
                                MemberData: req.session.memberData
                            });
                    })
                    .catch(function (err) {
                        res.redirect(functions.redirectWithError(req, err.error.Error));
                    });
            } else {
                res.redirect(functions.redirectWithError(req, 'Missing or invalid artwork id'));
            }
        } else {
            res.redirect(functions.redirectWithError(req, 'Only admins can edit artworks'));
        }
    } else {
        res.redirect('/login');
    }
});

module.exports = router;
