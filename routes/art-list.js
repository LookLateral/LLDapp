/* Test GET to Taurus API for sysadmin artwork metadata list. */
var express = require('express');
var flash = require('connect-flash');
var functions = require('../functions.js');
var rp = require('request-promise');

// Load the environment config
var environmentConfig = require('../environment.json');

var router = express.Router();

router.get('/', function (req, res, next) {
    if (req.session.memberData &&
        req.session.memberData.Role == 1) {
        var options = {
            method: 'GET',
            uri: environmentConfig.ApiServer + '/sysadmin/artwork',
            headers: {
                'User-Agent': 'Request-Promise',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + req.session.memberData.Token
            },
            json: true // Automatically stringifies the body to JSON
        };

        rp(options)
            .then(function (json) {
                // GET succeeded...
                res.render('art-list', { title: 'Look Lateral Test Sysadmin Art List', ApiServer: environmentConfig.ApiServer, MemberData: req.session.memberData, ErrorText: req.flash('error'), Galleries: json["Galleries"] });
            })
            .catch(function (err) {
                // GET failed...
                console.log(err);
                res.redirect(functions.redirectWithError(req, err.error.Error));
            });
    } else {
        res.redirect('/login');
    }
});	      

module.exports = router;
