var express = require('express');
var functions = require('../functions.js');
var rp = require('request-promise');

// Load the environment config
var environmentConfig = require('../environment.json');

var router = express.Router();

/* POST for artwork buy */
router.post('/art-detail-reserve-post', function (req, res, next) {
    if (req.session.memberData) {
        if (req.body.artworkId) {
            var artworkId = req.body.artworkId;

            var options = {
                method: 'POST',
                uri: environmentConfig.ApiServer + '/artwork/' + artworkId + '/reserve',
                headers: {
                    'User-Agent': 'Request-Promise',
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + req.session.memberData.Token
                },
                body: {
                    galleryid: req.body.galleryId,
                    percentage: req.body.percentage,
                    purchasetokens: req.body.purchaseTokens,
                    purchasetransactionid: req.body.purchaseTransactionId,
                    reservetokens: req.body.reserveTokens,
                    reservetransactionid: req.body.reserveTransactionId
                },
                json: true // Automatically stringifies the body to JSON
            };

            rp(options)
                .then(function () {
                    res.redirect('/member-dashboard');
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