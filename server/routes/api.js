var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user.js');
var Hangout = require('../models/hangout');


router.post('/register', function(req, res) {
  User.register(new User({ username: req.body.username }),
    req.body.email,
    req.body.password, function(err, account) {
    if (err) {
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
    console.log('it gets to here and then it breaks');
    console.log(request.body);
    if (!request.body) {
        return response.status(400).json({
            message: "No request body"
        });
    }

    if (!('hangout' in request.body)) {
        return response.status(422).json({
            message: 'Missing field: Hangout Name'
        });
    }

    var hangoutName = request.body.hangout;

    if (typeof hangoutName !== 'string') {
        return response.status(422).json({
            message: 'Incorrect field type: Hangout Name'
        });
    }

    hangoutName = hangoutName.trim();

    if (hangoutName === '') {
        return response.status(422).json({
            message: 'Incorrect field length: Hangout Name'
        });
    }
    
    var invited = request.body.invited;

    if (typeof invited !== 'object') {
        return response.status(422).json({
            message: 'Incorrect field type: invited'
        });
    }
    if (!('date' in request.body)) {
        return response.status(422).json({
            message: 'Missing field: date'
        });
    }

    var date = request.body.date;

    if (typeof date !== 'string') {
        return response.status(422).json({
            message: 'Incorrect field type: start date'
        });
    }

    date = date.trim();

    if (date === '') {
        return response.status(422).json({
            message: 'Incorrect field length: date'
        });
    }
    
    var createdHangout = new Hangout({
        hangout: hangoutName,
        invited: invited,
        date: date,
        owner: request.user
    });
    console.log(request.user);
    Hangout.find({hangout: hangoutName}, function(err, results){
        if (results.length !== 0){
            return response.status(409).json({message: 'hangout already exists'});
        } else {
            //was erroring because username already existed so had to add the above ^
            createdHangout.save(function(err) {
                if (err) {
                    console.log(err);
                    return response.status(500).json({
                        message: 'Internal server error'
                    });
                }
                console.log(createdHangout);
                return response.status(201).json();
            });
        }

    });
});

module.exports = router;