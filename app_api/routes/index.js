'use strict';
// Defines all the routes for the API
// API:
//      family

var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
    secret: process.env.JWT_SECRET
});
var ctrlConfiguration = require('../controllers/configuration');

//  Family
//      This is a simple object that all the persons in the family belong to
//      it should contain all the configuration parameters that is common to the people in the family
router.get('/configuration/family/:familyid',auth,ctrlConfiguration.familyReadOne);
router.post('/configuration/family/new',auth,ctrlConfiguration.familyCreate);
router.put('/configuration/family/:familyid',auth,ctrlConfiguration.familyUpdateOne);
//      Added delete for completeness and future reference - once a family is created, there is no need
//      to delete it, the user should simply update the existing record
//router.delete('/configuration/family/:familyid',ctrlConfiguration.familyDeleteOne);

// Person (Family members
//      These are the people that make up the family
router.get('/configuration/person/:personid',auth,ctrlConfiguration.personReadOne);
router.post('/configuration/person/new',auth,ctrlConfiguration.personCreate);
router.put('/configuration/person/:personid',auth,ctrlConfiguration.personUpdateOne);
router.delete('/configuration/person/:personid',auth,ctrlConfiguration.personDeleteOne);
module.exports = router;
