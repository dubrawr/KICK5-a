// dependencies
var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var mongoose = require('mongoose');
var hash = require('bcrypt-nodejs');
var path = require('path');
var passport = require('passport');
var localStrategy = require('passport-local' ).Strategy;

// mongoose
mongoose.connect('mongodb://localhost/mean-auth');

// user schema/model
var User = require('./models/user.js');
var Hangout = require('./models/hangout');

// create instance of express
var app = express();

// require routes
var routes = require('./routes/api.js');

// define middleware
app.use(express.static(path.join(__dirname, '../client')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'secretsquirrel',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// configure passport
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// routes
app.use('/user/', routes);

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

// error hndlers
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.end(JSON.stringify({
    message: err.message,
    error: {}
  }));
});


//POST for new Hangouts
app.post('/hangouts', function(request, response) {
    console.log(request.user);
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

    date = dateate.trim();

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
//end hangout post

app.get('/hangouts', function(request, response){
    Hangout.find({owner: request.user}, function(err, results){
        console.log(results);
        response.json(results);
    });

});















module.exports = app;
