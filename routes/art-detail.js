var express = require('express');
var flash = require('connect-flash');
var formatCurrency = require('format-currency');
var functions = require('../functions.js');
var rp = require('request-promise');

// Load the environment config
var environmentConfig = require('../environment.json');

var router = express.Router();

/* GET artwork details page. */
router.get('/', function (req, res, next) {
    if (req.session.memberData) {
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
                    // GET succeeded...
                    var artworkOwnerPercentage = 0;
                    var artworkOwnerStatus = 0;
                    var galleryOwner = false;
                    var purchaseTransactionId = 0;

                    if (req.session.memberData.OwnedGalleries) {
                        for (var i = 0; i < req.session.memberData.OwnedGalleries.length; i++) {
                            if (req.session.memberData.OwnedGalleries[i].Id == artworkData.GalleryId) {
                                galleryOwner = true;
                                break;
                            }
                        }
                    }

                    if (artworkData.ArtworkOwners && artworkData.ArtworkOwners.length > 0) {
                        for (var i = 0; i < artworkData.ArtworkOwners.length; i++) {
                            if (artworkData.ArtworkOwners[i].Email === req.session.memberData.Email) {
                                artworkOwnerPercentage = artworkData.ArtworkOwners[i].PercentageOwned;
                                artworkOwnerStatus = artworkData.ArtworkOwners[i].PurchaseStatus;
                                purchaseTransactionId = artworkData.ArtworkOwners[i].PurchaseTransactionId;
                                break;
                            }
                        }
                    }

                    var availablePercentage = (artworkData.FractionalizedPercentage - artworkData.TotalPurchased) / 100.0;
                    var remainingPrice = artworkData.Price * availablePercentage;
                    var lookLateralTokenPrice = remainingPrice * environmentConfig.ExchangeRates.Look;

                    var buyDollars = 0;
                    var buyTokens = 0;

                    if (artworkOwnerStatus == 2) {
                        buyDollars = artworkData.Price * (artworkOwnerPercentage / 100.0);
                        buyTokens = buyDollars * environmentConfig.ExchangeRates.Look;
                    }

                    res.render('art-detail',
                        {
                            title: artworkData.Title,
                            ApiServer: environmentConfig.ApiServer,
                            MemberData: req.session.memberData,
                            ErrorText: req.flash('error'),
                            Artwork: artworkData,
                            ArtworkId: artworkId,
                            ArtworkOwnerStatus: artworkOwnerStatus,
                            BuyDollars: formatCurrency(buyDollars, { format: '%s%v', symbol: '$' }),
                            BuyTokens: buyTokens.toFixed(6) + purchaseTransactionId.toString(),
                            IsGalleryOwner: galleryOwner,
                            IsSysAdmin: (req.session.memberData.Role == 1),
                            Price: formatCurrency(artworkData.Price, { format: '%s%v', symbol: '$' }),
                            RemainingPrice: formatCurrency(remainingPrice, { format: '%s%v', symbol: '$' }),
                            LookLateralTokenPrice: lookLateralTokenPrice.toFixed(6),
                            ExchangeRateEth: environmentConfig.ExchangeRates.Eth,
                            ExchangeRateLook: environmentConfig.ExchangeRates.Look,
                            ExchangeRateReserve: environmentConfig.ExchangeRates.Reserve,
                            GalleryWalletAddress: artworkData.GalleryWallet,
                            SystemWalletAddress: environmentConfig.SystemWalletAddress
                        });
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
