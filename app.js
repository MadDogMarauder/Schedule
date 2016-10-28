var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');
var setupPassword = require('./app_server/javascript/setupPassport');

var routes = require('./app_server/routes/index');
var users = require('./app_server/routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// Not sure on the following:
app.use(session({
    secret: "TKRv0IJs=whyNotSelectAsecret1208%$",
    resave: true,
    saveUninitialized: true
}));

app.use(flash());

// Set the public files for the application. All under 'public'
app.use(express.static(path.join(__dirname,'public')));
setupPassword(app);

app.use(routes);


// Handle requests for unknown sources 404 errors
// This works by creating an error and passing it to the error handler below
app.use(function (req, res) {
    var err = new Error('Page not found.');
    err.status = 404;
    console.error(err);

    res.render('error',{
        message: err.message,
        error:{}
    })
});


// error handlers



// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
