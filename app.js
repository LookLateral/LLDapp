var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var rp = require('request-promise');
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');
var session = require('express-session');
var flash = require('connect-flash');

var indexRouter = require('./routes/index');
var aboutusRouter = require('./routes/about-us');
var howitworksRouter = require('./routes/how-it-works');
var privacypolicyRouter = require('./routes/privacypolicy');
var termsofserviceRouter = require('./routes/termsofservice');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var registerRouter = require('./routes/register');
var registerstripeRouter = require('./routes/register-stripe');
var settingsRouter = require('./routes/settings');
var memberdashboardRouter = require('./routes/member-dashboard');
var gallerydashboardRouter = require('./routes/gallery-dashboard');
var artpublishRouter = require('./routes/art-publish');
var artpublishimageRouter = require('./routes/art-publish-image');
var artpublishprovenanceRouter = require('./routes/art-publish-provenance');
var artpublishthumbnailRouter = require('./routes/art-publish-thumbnail');
var artpublishqrcodeRouter = require('./routes/art-publish-qrcode');
var artdetailRouter = require('./routes/art-detail');
var artdetailapproveRouter = require('./routes/art-detail-approve');
var artdetailbuyRouter = require('./routes/art-detail-buy');
var artdetaileditRouter = require('./routes/art-detail-edit');
var artdiscoverRouter = require('./routes/art-discover');
var artmyartRouter = require('./routes/art-myart');
var artgalleryartRouter = require('./routes/art-galleryart');

// Sysadmin routes
var artlistRouter = require('./routes/art-list');

// POST to Taurus API routes
var loginpostRouter = require('./routes/login-post');
var memberpasswordpostRouter = require('./routes/member-password-post');
var memberwalletpostRouter = require('./routes/member-wallet-post');
var registerpostRouter = require('./routes/register-post');
var artdeletepostRouter = require('./routes/art-delete-post');
var artdetailbuypostRouter = require('./routes/art-detail-buy-post');
var artdetaileditpostRouter = require('./routes/art-detail-edit-post');
var artdetailreservepostRouter = require('./routes/art-detail-reserve-post');
var artdetailsellpostRouter = require('./routes/art-detail-sell-post');
var artpublishpostRouter = require('./routes/art-publish-post');
var artpublishimagepostRouter = require('./routes/art-publish-image-post');
var artpublishprovenancepostRouter = require('./routes/art-publish-provenance-post');
var artpublishthumbnailpostRouter = require('./routes/art-publish-thumbnail-post');
var artpublishqrcodepostRouter = require('./routes/art-publish-qrcode-post');
var gallerydeletepostRouter = require('./routes/gallery-delete-post');

// GET to Taurus API routes
var artdiscoverRouter = require('./routes/art-discover');

var app = express();

// view engine setup
// app.set('views', [path.join(__dirname, 'views'),
// 	path.join(__dirname, 'views/sysadmin')]);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 }
}));
app.use(flash());

var sess = {
    maxAge: 5 * 60 * 60 * 1000,
    name: 'TaurusID',
    resave: true,
    rolling: true,
    secret: 'S@1amanca',
    saveUninitialized: true,
    cookie: {}
}

if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
    sess.cookie.secure = true;
}

app.use(session(sess));

app.use('/', indexRouter);
app.use('/about-us', aboutusRouter);
app.use('/how-it-works', howitworksRouter);
app.use('/privacypolicy', privacypolicyRouter);
app.use('/termsofservice', termsofserviceRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/register', registerRouter);
app.use('/register-stripe', registerstripeRouter);
app.use('/settings', settingsRouter);
app.use('/member-dashboard', memberdashboardRouter);
app.use('/gallery-dashboard', gallerydashboardRouter);
app.use('/art-publish', artpublishRouter);
app.use('/art-publish-image', artpublishimageRouter);
app.use('/art-publish-provenance', artpublishprovenanceRouter);
app.use('/art-publish-thumbnail', artpublishthumbnailRouter);
app.use('/art-publish-qrcode', artpublishqrcodeRouter);
app.use('/art-detail', artdetailRouter);
app.use('/art-detail-approve', artdetailapproveRouter);
app.use('/art-detail-buy', artdetailbuyRouter);
app.use('/art-detail-edit', artdetaileditRouter);
app.use('/art-discover', artdiscoverRouter);
app.use('/art-myart', artmyartRouter);
app.use('/art-galleryart', artgalleryartRouter);


// Sysadmin 
app.use('/art-list', artlistRouter);

// POST to Taurus API
app.post('/login-post', loginpostRouter);
app.post('/member-password-post', memberpasswordpostRouter);
app.post('/member-wallet-post', memberwalletpostRouter);
app.post('/register-post', registerpostRouter);
app.post('/art-delete-post', artdeletepostRouter);
app.post('/art-detail-buy-post', artdetailbuypostRouter);
app.post('/art-detail-edit-post', artdetaileditpostRouter);
app.post('/art-detail-reserve-post', artdetailreservepostRouter);
app.post('/art-detail-sell-post', artdetailsellpostRouter);
app.post('/art-publish-post', artpublishpostRouter);
app.post('/art-publish-image-post', artpublishimagepostRouter);
app.post('/art-publish-provenance-post', artpublishprovenancepostRouter);
app.post('/art-publish-thumbnail-post', artpublishthumbnailpostRouter);
app.post('/art-publish-qrcode-post', artpublishqrcodepostRouter);
app.post('/gallery-delete-post', gallerydeletepostRouter);

//GET to Taurus API
app.get('/art-discover', artdiscoverRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

module.exports = app;
