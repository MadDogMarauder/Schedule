'use strict';
var models = require('../models');
var express = require('express');
var passport = require('passport');
var router = express.Router();

//isAuthenticated
function isAuthenticated(req,res,next){
    if (req.isAuthenticated()){
        next();
    }else{
        req.flash('info','You must be logged in to see this page.');
        res.redirect('/login');
    }
}

// Variables for templates
router.use(function (req,res,next){
    res.locals.currentUser = req.user;
    res.locals.errors = req.flash('error');
    res.locals.infos = req.flash('info');
    next();
});

/* GET home page. */
router.get('/', function(req, res) {
    models.User.findAll({
        order: '"createdAt" DESC'
    })
        .then(function(users){
            res.render('index', {
                title: 'Family Schedule',
                users: users
            });
        });
});

//user signup
router.get('/signup',function(req,res){
    res.render('signup');
});
router.post('/signup', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    models.User.findOne({
        where: {
            username: username
        }
    })
        .then(function (user) {
            if (user) {
                //user found
                console.info('User ' + username + ' found. User already exists.');
                req.flash('error', 'User already exists');
            }
            else {
                console.log('User not found');
            }
            var  User = models.User;
            var newUser = User.build({
                username: username,
                password: password
            });

            newUser.save()
                .then(function(){
                    console.log('User ' + username + ' saved!');
                }
                ).catch(function(error){
                    console.log('Could not save to the database!');
                    console.log(error);
            });
        });
}, passport.authenticate('login',{
    successRedirect:'/',
    failureRedirect: '/signup',
    failureFlash:true
}));

router.get('/users/:username', function (req,res,next) {
    models.User.findOne({
        where: {
            username: username
        }
    })
        .then(function (user) {
            if (!user) {
                return next(404);
            }
            res.render('profile',{
                user: user
            });
        })
        .catch (function(err){
            if(err){return next (err);}
        });
});

router.get('/login',function(req,res){
   res.render('login');
});

router.post('/login',passport.authenticate('local',{
    successRedirect:'/',
    failureRedirect: '/login',
    failureFlash: 'Failed to authenticate'
}));
router.get('/logout',function(req,res){
    req.logout();
    res.redirect('/');
});
module.exports = router;
