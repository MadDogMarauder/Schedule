'use strict';
// This file will create the schedule users
// Users:   People that will log into the application and modify the schedule
//          Recipients of notices

var bcrypt = require('bcrypt-nodejs');
var SALT_FACTOR = 10;

module.exports = function (sequelize, DataTypes){
    var User = sequelize.define('User',{
        username: {
            type: DataTypes.STRING,
            allowNull:false,
            unique: true
        },
        firstname: {
            type: DataTypes.STRING
        },
        lastname: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            // Add validation
            isEmail: true
        }
    },{
        // Do not delete records
        paranoid: true,
        tableName: 'users'
    });
    return User;
};
