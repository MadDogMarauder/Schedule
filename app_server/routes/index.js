'use strict';
var models = require('../models');
var express = require('express');
var passport = require('passport');
var router = express.Router();
var ctrlLogin = require('../controllers/user');
var ctrlEvents = require('../controllers/events');

// Goal is to create a single routes file that uses a controller with a logical collection of screens

//isAuthenticated
//User permission function that checks the user has authorization to access the screen
function userAuthenticated(req,res,next){
    if (req.isAuthenticated()){
        next();
    }else{
        req.flash('info','You must be logged in to see this page.');
        res.redirect('/login');
    }
}

/* GET home page. */
router.get('/',ctrlEvents.homelist);

//user signup
router.get('/signup',ctrlLogin.userSignup);
// todo this does not appear to log the user into the home page
router.post('/signup', ctrlLogin.userSignupSave, passport.authenticate('login',{
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

// User Management
router.get('/login', ctrlLogin.userLogin);
router.post('/login',passport.authenticate('local',{
    successRedirect:'/',
    failureRedirect: '/login',
    failureFlash: 'Failed to authenticate'
}));
router.get('/logout',function(req,res){
    req.logout();
    res.redirect('/');
});

router.get('/editUser',userAuthenticated,function (req,res) {
    res.render('editUser');
});
router.post('/editUser',userAuthenticated,function (req, res, next) {
    console.log('Requet: ',req.body);
    req.user.firstname = req.body.firstname;
    req.user.lastname = req.body.lastname;
    req.user.save()
        .then(function (user)
        {
            req.flash('info','User '+ user.username +'updated!');
            res.redirect('/editUser');
        }
        )
        .catch(function(err){
        if(err){
            return next(err);
        }});
});
module.exports = router;
