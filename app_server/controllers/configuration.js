var request = require('request');
var apiOptions = {
    server: 'http://localhost:3000'
};

var _showError = function(req,res,status,data){
    var err = new Error;
    err.status = status;
    if (status === 404){
        err.message = 'page not found';
    }else{
        err.message = 'something has gone wrong';
    }
    console.error(status);
    console.log(data);
    res.render('error',{
        message: err.message,
        error: err
    })
};
var getFamilyInfo = function(req, res, callback){
    var requestOptions, path;
    var token = req.user.generateJwt();

    path = '/api/configuration/family/' + req.params.familyid;
    requestOptions = {
        url: apiOptions.server + path,
        method: 'GET',
        headers: {'authorization': 'Bearer '+ token},
        json: {}
    };
    request(requestOptions,function(err,response,body){
        if (response.statusCode===200){
            callback(req,res,body);
        }else {
            _showError(req,res,response.statusCode);
        }
    });
};

var renderFamilyReadOne = function (req,res, responseBody) {
    res.render('configurationFamily',{
        family: responseBody
    });
};
var renderFamilyCreate = function (req,res) {
    res.render('configurationFamily',{
        createNewFamily: true
    });
};
// Create an empty form to add the family
module.exports.familyNew = function (req,res){
    renderFamilyCreate(req,res);
};

// Read family from the database and display results
module.exports.familyReadOne = function (req,res) {
    getFamilyInfo(req,res, function(req,res,responseData){
        console.log(responseData);
        renderFamilyReadOne(req,res, responseData);
    });
};

module.exports.familyUpdate = function (req,res){
    var requestOptions, path;
    var token = req.user.generateJwt();
    path = '/api/configuration/family/' + req.params.familyid;
    requestOptions = {
        url: apiOptions.server + path,
        method: 'PUT',
        headers: {'authorization': 'Bearer '+ token},
        json: {
            name: req.body.name,
            location: req.body.location
        }
    };
    console.log(requestOptions);
    request(requestOptions,function(err,response,data){
        console.log(data);
        console.log(response.body);
        if (response.statusCode===200){
            renderFamilyReadOne(req,res,data);
        }else {
            _showError(req,res,response.statusCode,data);
        }
    });
};