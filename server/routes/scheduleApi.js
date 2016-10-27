var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var q = require('q');

var User = require('../models/user.js');
var Hangout = require('../models/hangout.js');
var Schedule = require('../models/schedule.js');

router.get('/:id', function(request,response){
  Schedule.find({hangoutId: request.params.id}, function(err,results){
    console.log('SCHEDULE GET RESULTS: '+ results);
    // console.log(results + ' these are the results for schedule GET');
    response.json(results);

  });
});

module.exports = router;