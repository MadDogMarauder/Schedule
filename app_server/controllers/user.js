var Sequelize = require('sequelize');
var models = require('../models');


// login controller

// Login form for the site
module.exports.userLogin = function(req,res){
    res.render('login',{
    });
};

// GET User Sign up
// Form for users to sign up for the system
module.exports.userSignup = function (req,res){
    res.render('signup',{

    });
};

// POST User Sing up
// Saves the user information into the database
module.exports.userSignupSave = function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    models.User.findOne({
        where: Sequelize.where(Sequelize.fn('lower',Sequelize.col('username')),Sequelize.fn('lower',username))

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

// GET Edit User
module.exports.userEdit = function (req,res) {
    models.Family.findById(req.user.FamilyId,{include: [ models.Person], order: '"People.firstname" ASC'} )
    // models.Family.findAll({
    //     include: [{
    //         model: models.Person,
    //         where: {id: req.user.FamilyId}
    //     }]
    // })
        .then(function(family){
            //family found
            res.render('editUser',{
                family: family,
                topMenu: 'Configuration'
            });
        }).catch(function(err){
            req.flash('error','While finding family');
            console.error(err);
    });



};

// POST Save user changes
module.exports.userEditSave = function (req, res, next) {
    console.log('Request: ',req.body);
    var oldPassword = req.body.oldpassword;
    var newPassword = req.body.newpassword;

    req.user.isMatch(oldPassword,function(matchErr,matchFound){
        if (matchErr) {
            // It should give the user an error message
            req.flash('error','Could not save. Error:'+err.message);
            res.redirect('/editUser');
            return done(matchErr);
        }
        if (matchFound){
            req.user.password = newPassword;
            req.user.save()
                .then(function (user)
                    {
                        console.log('Updated password!');
                        req.flash('success','User '+ user.username +' updated!');
                        res.redirect('/editUser');
                        return done(null,req.user);
                    }
                )
                .catch(function(err){
                    if(err){
                        return next(err);
                    }});
        }
        if (matchFound === false){
            // If the program gets to this level, then the password is invalid
            req.flash('error', 'Could not save user. Invalid password entered.');
            res.redirect('/editUser');
        }
    });


};