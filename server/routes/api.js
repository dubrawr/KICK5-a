var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');

var User = require('../models/user.js');
var Hangout = require('../models/hangout.js');
var Schedule = require('../models/schedule.js');


router.post('/register', function(req, res) {
  User.register(new User({ username: req.body.username }),
    req.body.password, function(err, account) {
      if (err) {
        console.log(err);
        return res.status(500).json({
          err: err
        });
      }
      passport.authenticate('local')(req, res, function () {
        return res.status(200).json({
          status: 'Registration successful!'
        });
      });
    });
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
      res.status(200).json({
        status: 'Login successful!'
      });
    });
  })(req, res, next);
});

router.get('/logout', function(req, res) {
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});

router.get('/status', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      status: false
    });
  }
  res.status(200).json({
    status: true
  });
});

//hangouts
router.post('/hangouts', function(request, response) {
  console.log(request.body);

  var owner = request.user;
  console.log('this is the owner:' + owner);
  var hangoutName = request.body.hangout;

  hangoutName = hangoutName.trim();

  var invited = request.body.invited;

  var startDate = request.body.startDate.trim();
  var endDate = request.body.endDate.trim();

  var createdHangout = new Hangout({
    hangout: hangoutName,
    invited: invited,
    startDate: startDate,
    endDate: endDate,
    owner: owner
  });
  console.log(request.user + 'this is the request.user');
  Hangout.find({hangout: hangoutName}, function(err, results){
    if (results.length !== 0){
      return response.status(409).json({message: 'hangout already exists'});
    } else {
            //was erroring because hangout name already existed so had to add the above ^
            createdHangout.save(function(err) {
              if (err) {
                console.log(err);
                return response.status(500).json();
              }
              console.log(createdHangout + 'this is the created hangout');
              return response.status(201).json();
            });
          }

        });
});

router.get('/hangouts', function(request, response){
    Hangout.find({owner: request.user}, function(err, results){
        console.log(results);
        response.json(results);
    });

});
router.get('/hangouts/:id', function(request, response){
  Hangout.find({_id: request.params.id}, function(err,results){
    console.log(results);
    response.json(results);


  });

router.post('/schedule', function(request, response){
  var hangoutId = request.body.hangoutId;
  var availability = request.body.availability;
  var createdSchedule = new Schedule({
    hangoutId: hangoutId,
    user: request.user,
    availability: availability
  });
  createdSchedule.save(function(err){
    if (err){
      console.log(err);
      return response.status(500).json();
      }
    console.log(createdSchedule + 'this is the created schedule');
    return response.status(201).json();
  });
});

router.get('/schedule', function(request,response){
  Schedule.find({user: request.user}, function(err,results){
    console.log(results + ' these are the results for schedule GET');
    response.json(results);

  });
});

});

module.exports = router;