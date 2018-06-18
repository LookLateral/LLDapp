/* Test POST to Taurus API for artwork provenance publish. */
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

router.post('/art-publish-provenance-post', function (req, res, next) {
    if (req.session.memberData) {
        if (req.files) {
            var options = {
                method: 'POST',
                uri: environmentConfig.ApiServer + '/artwork/' + req.body.ArtworkId + '/uploadProvenance',
                body: {
                    artworkid: req.body.ArtworkId,
                    email: req.body.email,
                    filebytes: Buffer.from(req.files.FileName.data).toString('base64'),
                    filename: req.files.FileName.name
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
            res.redirect(functions.redirectWithError(req, 'No provenance file was uploaded'));
        }
    } else {
        res.redirect('/login');
    }
});

module.exports = router;
