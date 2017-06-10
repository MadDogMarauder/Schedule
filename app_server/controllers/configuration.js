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
        err.message = 'Error from API: ' + data.message;
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
    var family = {
        name: '',
        location: ''
    };
    res.render('configurationFamily',{
        createNewFamily: true,
        family: family,
        token:req.user.generateJwt()
    });
};

// Create an empty form to add the family
module.exports.familyNew = function (req,res){
    renderFamilyCreate(req,res);
};

// Read family from the database and display results
module.exports.familyReadOne = function (req,res) {
    getFamilyInfo(req,res, function(req,res,responseData){
        renderFamilyReadOne(req,res, responseData);
    });
};
module.exports.familyCreate = function (req,res) {
    var requestOptions, path;
    var token = req.user.generateJwt();
    path = '/api/configuration/family/new';
    console.log(token);
    requestOptions = {
        url: apiOptions.server + path,
        method: 'POST',
        headers: {'authorization': 'Bearer '+ token},
        json: {
            name: req.body.name,
            location: req.body.location,
            userid: req.body.userid
        }
    };
    console.log(requestOptions);
    request(requestOptions,function(err,response,data){
        console.log(data);
        console.log(response.body);
        if (response.statusCode===201){
            renderFamilyReadOne(req,res,data);
        }else {
            _showError(req,res,response.statusCode,data);
        }
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

var renderPersonReadOne = function(req,res,responseBody){
    console.log('Render Person. Data:' + responseBody);
    if (!responseBody.person) {
        res.render('configurationPerson',{
            person: responseBody,
            topMenu: 'Configuration'
        })
    }
    else {
        res.render('configurationPerson',{
            person: responseBody.person,
            topMenu: 'Configuration'
        })
    }

};
module.exports.personNew = function (req,res){
    renderPersonReadOne(req,res,{
        'firstname': '',
        'familyrole': '',
        'email': ''
    })
};
module.exports.personCreate = function(req,res){
    sendAPIRequest(req,res,'/api/configuration/person/new','POST',{
        firstname: req.body.firstname,
        familyrole: req.body.familyrole,
        email: req.body.email,
        familyid: req.user.FamilyId
    },function(req,res,data){
        req.flash('success',data.message);
        res.redirect('/editUser');
    });

};

module.exports.personReadOne = function (req,res){
    sendAPIRequest(req,res,'/api/configuration/person/'+req.params.personid,
        'GET',{},function(req,res,responseData){
            renderPersonReadOne(req,res,responseData);
        });
};
module.exports.personDelete = function (req,res){
    sendAPIRequest(req,res,'/api/configuration/person/'+req.params.personid,'DELETE',{},
        function(req,res,data){
            req.flash('success',data.message);
            res.redirect('/editUser');
        });
};
module.exports.personUpdateOne = function (req,res){
    var person = {
        firstname : req.body.firstname,
        familyrole: req.body.familyrole,
        email: req.body.email
    };
    sendAPIRequest(req,res,'/api/configuration/person/'+req.params.personid,'PUT',person,
        function(req,res,data){
            req.flash('success',data.message);
            res.redirect('/editUser');
        }
    );
};
var sendAPIRequest = function (req,res, apiPath, requestMethod, data, callback){
    var token = req.user.generateJwt();
    var requestOptions;
    requestOptions = {
        url: apiOptions.server + apiPath,
        method: requestMethod,
        headers: {'authorization': 'Bearer '+ token},
        json: data
    };
    request(requestOptions,function(err,response,body){
        if (((requestMethod === 'POST') && (response.statusCode === 201)) || ((requestMethod !== 'POST') && (response.statusCode===200))){
            callback(req,res,body);
        }else {
            _showError(req,res,response.statusCode);
        }
    });
};