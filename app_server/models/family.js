'use strict';
// This file will create the family
// Family:  The object that all users belong to it defines the family name and its primary location


module.exports = function (sequelize, DataTypes){
    var Family = sequelize.define('Family',{
        name: {
            type: DataTypes.STRING
        },
        location: {
            type: DataTypes.STRING
        },
        timezone: {
            type: DataTypes.STRING
        }
    }, {
        // Do not delete records
        paranoid: true,
        classMethods:{
            associate: function (models) {
                Family.hasMany(models.User);
                Family.hasMany(models.Person);
            }
        }
    });

    return Family;
};
