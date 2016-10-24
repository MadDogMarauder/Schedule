'use strict';
var models = require('../models');
var express = require('express');
var passport = require('passport');
var router = express.Router();

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


module.exports = router;
