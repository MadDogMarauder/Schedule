require('dotenv').config({path:'./app_server/config/.env'});
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
var enforeSSL = require('express-enforces-ssl');
var helmet = require('helmet');
var ms = require('ms');


var routes = require('./app_server/routes/index');
var routesApi = require('./app_api/routes/index');

var app = express();
//Security
// app.enable('trust proxy');
// app.use(enforeSSL());
// app.use(helmet.hsts({
//     maxAge : ms('1 year'),
//     includeSubdomains: true
// }));

app.disable('x-powered-by');
//Keep anyone from putting site in a frame
app.use(helmet.frameguard('deny'));
app.use(helmet.noSniff());
app.use(helmet.xssFilter());

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
    secret: process.env.USER_SESSION,
    resave: true,
    saveUninitialized: true
}));

app.use(flash());
//Token protection middleware

// Set the public files for the application. All under 'public'
app.use(express.static(path.join(__dirname,'public')));
setupPassword(app);


// Add a common set of variables that can be used for each page
app.use(function (req,res,next){
    res.locals.currentUser = req.user;
    res.locals.errors = req.flash('error');
    res.locals.infos = req.flash('info');
    res.locals.warnings = req.flash('warning');
    res.locals.successes = req.flash('success');
    if (req.user){
        res.locals.token = req.user.generateJwt();
    }
    next();
});

app.use(routes);
app.use('/api',routesApi);


// Handle requests for unknown sources 404 errors
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

// Handle CSRF errors
app.use(function(err,req,res,next){
    console.log(err);
    if (err.name === 'UnauthorizedError'){
        res.render('error',{
            message: 'Unauthorized error :' + err.message,
            error: err
        });
    }
    if (err){
        res.render('error',{
            message: err.message,
            error: err
        })
    }
    res.status(403);
    // ToDo: change error returned
    res.send('Authetication error');
});

// production error handler
// no stacktraces leaked to user
// app.use(function(err, req, res) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });


module.exports = app;
