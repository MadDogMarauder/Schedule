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
        // Do not delete records
        paranoid: true,
        tableName: 'users',
        instanceMethods: {
            checkPassword: function (password) {
                return bcrypt.hashSync(password, this.password);
            }
        },
        getterMethods:{
            fullName: function () {
                return this.firstname + ' ' + this.lastname;
            }
        }
    });


    //  Oct 24, 2016
    // sequelize runs hooks async which resulted in saving the record before the password was hashed
    // to get the code below to work, the "completion callback needs to be called"
    // return cb(null,options);
    var passwordHook = function(user,options, cb){
        if(!user.changed('password')){
            console.log('\t\t\tNo change in password. No need to hash the password.');
            return cb(null,options);
        }
        console.log('\t\t\tInfo: Creating a hash for the password');
        bcrypt.genSalt(SALT_FACTOR, function(err,salt){
            if (err){ return cb(err);}
            bcrypt.hash(user.password, salt, noop, function (err, hashedPassword){
                if (err){ return cb(err);}
                user.set('password', hashedPassword);
                console.log('\t\tHash:' + hashedPassword);
                console.log('\t\tUser.Password' + user.password);
                return cb(null,options);
            });
        });
    };
    User.beforeCreate(passwordHook);
    User.beforeUpdate(passwordHook);

    return User;
};



