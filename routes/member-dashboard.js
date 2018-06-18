var express = require('express');
var flash = require('connect-flash');
var formatCurrency = require('format-currency');
var functions = require('../functions.js');
var rp = require('request-promise');

// Load the environment config
var environmentConfig = require('../environment.json');

var router = express.Router();

/* GET Member Dashboard page. */
router.get('/', function (req, res, next) {
    if (req.session.memberData) {
        var options = {
            method: 'GET',
            uri: environmentConfig.ApiServer + '/artwork/memberDashboard',
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
                var artworks = json["Artworks"];
                var discoverArt = [];
                var myArt = [];

                for (var i = 0; i < artworks.length; i++) {
                    if (artworks[i].Sellable) {
                        artworks[i].Price = formatCurrency(artworks[i].Price, { format: '%s%v', symbol: '$' });
                    }

                    if (artworks[i].PanelIndex == 0) {
                        if (discoverArt.length < 3) {
                            discoverArt.push(artworks[i]);
                        }
                    } else {
                        if (myArt.length < 3) {
                            myArt.push(artworks[i]);
                        }
                    }
                }

                var transactions = json["Transactions"];
                if (transactions) {
                    for (var i = 0; i < transactions.length; i++) {
                        transactions[i].Look = (transactions[i].USD * environmentConfig.ExchangeRates.Look).toFixed(6);
                        transactions[i].PurchaseDate = new Date(transactions[i].PurchaseDate).toISOString().replace(/T.+/, '');
                        transactions[i].USD = formatCurrency(transactions[i].USD, { format: '%s%v', symbol: '$' })
                    }
                }

                res.render('member-dashboard', { title: 'Look Lateral Test Member Dashboard', ApiServer: environmentConfig.ApiServer, ErrorText: req.flash('error'), MemberData: req.session.memberData, DiscoverArt: discoverArt, MyArt: myArt, Galleries: json["Galleries"], Transactions: transactions });
            })
            .catch(function (err) {
                // GET failed...
                console.log(err);
                res.redirect(functions.redirectWithError(req, 'Unable to load member dashboard: ' + err.error.Error));
            });
    } else {
        res.redirect('/login');
    }
});

module.exports = router;

