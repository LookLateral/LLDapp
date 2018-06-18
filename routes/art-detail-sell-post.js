var express = require('express');
var functions = require('../functions.js');
var rp = require('request-promise');

// Load the environment config
var environmentConfig = require('../environment.json');

var router = express.Router();

/* POST for artwork sell */
router.post('/art-detail-sell-post', function (req, res, next) {
    if (req.session.memberData) {
        if (req.body.artworkId && req.body.galleryId) {
            var artworkId = req.body.artworkId;
            var galleryId = req.body.galleryId;

            var options = {
                method: 'POST',
                uri: environmentConfig.ApiServer + '/artwork/' + artworkId + '/sell',
                headers: {
                    'User-Agent': 'Request-Promise',
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + req.session.memberData.Token
                },
                body: {
                    artworkId: artworkId,
                    galleryId: galleryId,
                    fractionalizedpercentage: req.body.percentage,
                    price: req.body.price
                },
                json: true // Automatically stringifies the body to JSON
            };

            rp(options)
                .then(function () {
                    res.redirect('/art-detail?artworkId=' + artworkId);
                })
                .catch(function (err) {
                    // POST failed...
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