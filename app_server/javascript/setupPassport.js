'use strict';

var models = require('../models'); // used for the user model used for authentication
var passport = require('passport');// passport library
var LocalStrategy = require('passport-local').Strategy;


module.exports = function (app) {
    // passport initialization
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function(user,done){
        done(null,user.id);
    });
    passport.deserializeUser(function(id,done){
        models.User.findOne({
            where: {
               id:id
            }
       }).then(function(user){
           done(null, user);
       }).catch(function(err){
           done(err);
       });
    });

    // Define how to authenticate the user
    passport.use(new LocalStrategy(function (username, password,done){
        models.User.findOne({
            where: {
                username: username
            }

        }) .then(function(user){
            if(!user) {
                return done(null, false, {message: 'Unknown user.'});
            }
            user.isMatch(password,function(err,isMatch){
                if (err) {return done(err);}
                if (isMatch){return done(null,user);}
                return done(null,false, { message: 'Invalid password.'});
            });
        });
    }));
};