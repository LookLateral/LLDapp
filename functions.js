"use strict";

var flash = require('connect-flash');
var url = require('url');

module.exports.redirectWithError = function (req, errorText) {
    var referrer = req.get('Referrer');

    req.flash('error', errorText);

    if (referrer !== 'undefined' && referrer !== null) {
        var u = url.parse(referrer);
        return u.pathname + (u.search != null && u.search != '' ? u.search : '');
    } else {
        return '/';
    }
}
