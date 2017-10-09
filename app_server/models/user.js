'use strict';
// This file will create the schedule users
// Users:   People that will log into the application and modify the schedule
//          Recipients of notices

var bcrypt = require('bcrypt-nodejs');
var SALT_FACTOR = 10;
var jwt = require('jsonwebtoken');

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
        }
    }, {
        // Do not delete records
        paranoid: true,
        tableName: 'users',
        instanceMethods: {
            isMatch: function (guess,done) {
                bcrypt.compare(guess,this.password,function(err, isMatch){
                    done(err,isMatch);
                });
            },
            generateJwt: function(){
                var expiry = new Date();
                expiry.setDate(expiry.getDate()+7);

                return jwt.sign({
                    id: this.id,
                    username: this.username,
                    password: this.password,
                    exp: parseInt(expiry.getTime()/1000)
                },process.env.JWT_SECRET);
            }
        },
        classMethods:{
            associate: function (models) {
                User.belongsTo(models.Family);
                User.belongsTo(models.Person);
            }
        }
    });


    //  Oct 24, 2016
    // sequelize runs hooks async which resulted in saving the record before the password was hashed
    // to get the code below to work, the "completion callback needs to be called"
    // return cb(null,options);
    var passwordHook = function(user,options, cb){
        if(!user.changed('password')){
            return cb(null,options);
        }
        bcrypt.genSalt(SALT_FACTOR, function(err,salt){
            if (err){ return cb(err);}
            bcrypt.hash(user.password, salt, noop, function (err, hashedPassword){
                if (err){ return cb(err);}
                user.set('password', hashedPassword);
                return cb(null,options);
            });
        });
    };
    User.beforeCreate(passwordHook);
    User.beforeUpdate(passwordHook);

    return User;
};







