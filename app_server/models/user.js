'use strict';
// This file will create the schedule users
// Users:   People that will log into the application and modify the schedule
//          Recipients of notices

var bcrypt = require('bcrypt-nodejs');
var SALT_FACTOR = 10;

// Function use for password encryption
var noop = function () {
};

module.exports = function (sequelize, DataTypes){
    var User = sequelize.define('User',{
        username: {
            type: DataTypes.STRING,
            allowNull:false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        firstname: {
            type: DataTypes.STRING
        },
        lastname: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING,
            // Add validation
            isEmail: true
        }
    }, {
        getterMethods: {
            fullName: function () {
                return this.firstname + ' ' + this.lastname;
            },
            checkPassword: function (guess, done) {
                bcrypt.compare(guess, this.password, function (err, isMatch) {
                    done(err, isMatch);
                })
            }
        }
    },{
        // Do not delete records
        paranoid: true,
        tableName: 'users'
    });
    User.afterValidate(function(user, done){
        if(!user.changed('password')){
            console.log('\t\t\tNo change in password. No need to hash the password.');
            return done;
        }
        console.log('\t\t\tInfo: Creating a hash for the password');
        bcrypt.genSalt(SALT_FACTOR, function(err,salt){
            if (err){ return done(err);}
            bcrypt.hash(user.password, salt, noop, function (err, hashedPassword){
                if (err){ return done(err);}
                user.password= hashedPassword;
                console.log('\t\tHash:' + hashedPassword);
                console.log('\t\tUser.Password' + user.password);
                return done;
            });
        });
    });


    return User;
};



