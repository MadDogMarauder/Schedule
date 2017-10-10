'use strict';
// This file will create the events
// event:  The object that details all the events that are scheduled


module.exports = function (sequelize, DataTypes){
    var Event = sequelize.define('Event',{
        Description: {
            type: DataTypes.STRING
        },
        StartDate: {
            type: DataTypes.DATE
        },
        EndDate: {
            type: DataTypes.DATE
        },
        Location: {
            type: DataTypes.STRING
        },
        Notes: {
            type: DataTypes.TEXT
        },
        CreatedBy: {
            type: DataTypes.INTEGER
        },
        ModifiedBy: {
            type: DataTypes.INTEGER
        }
    }, {
        // Do not delete records
        paranoid: true,
        timestamps: true
    });

    return Event;
};