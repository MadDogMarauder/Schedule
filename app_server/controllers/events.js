var models = require('../models');

// EVENTS
// Events are all the appointments that are going to be scheduled
// Each of those events needs to be shown in a summary view that will include:
//      A calendar view
//      A table view arranged chronologically
// A page to enter new events and a page to search will round out the events functionality

// GET 'Home' page
//
// The home page displays all events for the family
module.exports.homelist = function(req,res){
    //Todo Switch from displaying all users to events

    //Proof of concept displaying all users in the system:
    models.User.findAll({
        order: '"createdAt" DESC'
    })
        .then(function(users){
            res.render('index', {
                title: 'Family Schedule',
                users: users
            });
        });
};

