'use strict';
// This file will create the persons in each of the families
//  Person: People that will be used in the application schedule
//          A person belongs to a single family and each family will have multiple persons

module.exports = function (sequelize, Datatypes){
    var Person = sequelize.define('Person', {
        firstname: {
            type: Datatypes.STRING,
            allowNull: false
        },
        familyrole: {
            type: Datatypes.STRING,
            allowNull: false
        },
        email: {
            type: Datatypes.STRING,
            // Add validation
            isEmail: true
        }
    },{
        //Options
        classMethods:{
            associate: function(models){
                Person.belongsTo(models.User);
                Person.belongsTo(models.Family);
            }
        }
    });
    return Person;
};
