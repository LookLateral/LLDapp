/* Test POST to Taurus API for artwork QR code publish. */
var express = require('express');
var fileUpload = require('express-fileupload');
var functions = require('../functions.js');
var rp = require('request-promise');

// Load the environment config
var environmentConfig = require('../environment.json');

var app = express();

app.use(fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 }
}));

var router = express.Router();

router.post('/art-publish-qrcode-post', function (req, res, next) {
    if (req.session.memberData) {
        if (req.files) {
            var options = {
                method: 'POST',
                uri: environmentConfig.ApiServer + '/artwork/' + req.body.ArtworkId + '/uploadQRCode',
                body: {
                    artworkid: req.body.ArtworkId,
                    filebytes: Buffer.from(req.files.FileName.data).toString('base64')
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
                    res.redirect('/art-list')
                })
                .catch(function (err) {
                    // POST failed...
                    console.log(err);
                    res.redirect(functions.redirectWithError(req, err.error.Error));
                });
        } else {
            res.redirect(functions.redirectWithError(req, 'No QR Code was uploaded'));
        }
    } else {
        res.redirect('/login');
    }
});

module.exports = router;
