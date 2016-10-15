// hangout model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Hangout = new Schema({
    hangout: {
        type: String,
        required: true,
        unique: true
    },
    start: {
        type: String,
        required: true,
    },
    end: {
        type: String,
        required: true
    },
    invited: [{
        type: String,
        required: true
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'}
});

module.exports = mongoose.model('hangouts', Hangout);
