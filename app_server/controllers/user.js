var models = require('../models');

// login controller

// Login form for the site
module.exports.userLogin = function(req,res){
    res.render('login',{
        csrfToken: req.csrfToken()
    });
};

// GET User Sign up
// Form for users to sign up for the system
module.exports.userSignup = function (req,res){
    res.render('signup',{
        csrfToken: req.csrfToken()
    });
};

// POST User Sing up
// Saves the user information into the database
module.exports.userSignupSave = function(req, res, next) {
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
                req.flash('error','User could not be saved');
                console.log(error);
            });
        });
};