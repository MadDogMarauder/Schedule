'use strict'
// Defines all the routes for the API
// API:
//      family

var express = require('express');
var router = express.Router();
var ctrlConfiguration = require('../controllers/configuration');

//  Family
//      This is a simple object that all the persons in the family belong to
//      it should contain all the configuration parameters that is common to the people in the family
router.get('/configuration/family/:familyid',ctrlConfiguration.familyReadOne);
router.post('/configuration/family/new',ctrlConfiguration.familyCreate);
router.put('/configuration/family/:familyid',ctrlConfiguration.familyUpdateOne);
router.delete('/configuration/family/:familyid',ctrlConfiguration.familyDeleteOne);

module.exports = router;
