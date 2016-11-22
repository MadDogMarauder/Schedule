// Configuration will contain all the configuration pages for the application with the exception of user
var models = require('../../app_server/models');
var request = require('request');
var Family = models.Family;
var apiOptions = {
    server: 'https://localhost:3000'
};
if (process.env.NODE_ENV === 'production'){
    apiOptions.server = 'https://myserver.ca.';
}

var sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

// displays the family configuration
module.exports.familyReadOne = function (req,res){
    if (req.params && req.params.familyid){
        Family.findById(req.params.familyid)
            .then(function(family){
                if (!family){
                    sendJsonResponse(res,404,{
                        'message': 'familyid not found'
                    });
                    return;
                }
                sendJsonResponse(res, 200, family);
            })
            .catch(function(err){
                sendJsonResponse(res,404,err);
            });
    }
    else {
        sendJsonResponse(res, 404, {
            'message': 'No familyid in request'
        });
    }

};
// Create a new family
module.exports.familyCreate = function (req,res) {

    var family = Family.build({
        name: req.body.name,
        location: req.body.location,
        timezone: 'MST'
    });
    console.log(req.body.userid);
    family.save()
        .then(function(){
            //Since the family has been created
            //the next step is linking the user to the family
            models.User.findById(req.body.userid)
                .then(function(user){
                    if(!user){
                        sendJsonResponse(res,404,{
                            'message':'user not found'
                        });
                        return;
                    }
                    //Link the family to the user
                    user.setFamily(family)
                        .then(function(user){
                            sendJsonResponse(res,201,{
                                'message':'family was created and user was updated'
                            });
                        }).catch(function(err){
                        sendJsonResponse(res,404,err);
                    });
                }).catch(function(err){
                sendJsonResponse(res,404,err);
            });
        }).catch(function(err){
            console.error(err);
            sendJsonResponse(res,400,err);
    });
};
module.exports.familyUpdateOne = function (req,res) {
    if (req.params && req.params.familyid){
        Family.findById(req.params.familyid)
            .then(function(family){
                if (!family){
                    sendJsonResponse(res,404,{
                        'message': 'familyid not found'
                    });
                    return;
                }
                family.name = req.body.name;
                family.location = req.body.location;
                family.save()
                    .then(function(){
                            sendJsonResponse(res,200,family);
                        }
                    ).catch(function(err){
                    sendJsonResponse(res,400,err);
                });
            })
            .catch(function(err){
                sendJsonResponse(res,404,err);
            });
    }
    else {
        sendJsonResponse(res, 404, {
            'message': 'No familyid in request'
        });
    }
};
module.exports.familyDeleteOne = function (req,res) {
    if (req.params && req.params.familyid){
        Family.findById(req.params.familyid)
            .then(function(family){
                if (!family){
                    sendJsonResponse(res,404,{
                        'message': 'familyid not found'
                    });
                    return;
                }
                family.destroy()
                    .then(function(rows){
                        if(rows===1){
                            sendJsonResponse(res,200,{
                                'message':'Family removed'
                            })
                        }
                        else{
                            sendJsonResponse(res, 400, {
                                'message' : 'Removed too many! Removed ' + rows + ' rows'
                            })
                        }

                    })
                    .catch (function(err){
                        sendJsonResponse(res,404,err);
                    });
            })
            .catch(function(err){
                sendJsonResponse(res,404,err);
            });
    }
    else {
        sendJsonResponse(res, 404, {
            'message': 'No familyid in request'
        });
    }
};