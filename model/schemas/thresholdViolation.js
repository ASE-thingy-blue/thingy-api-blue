const Mongoose = require('mongoose');

var thresholdViolationSchema = Mongoose.Schema({
    
    since: {
	type: Date,
	default: Date.now
    },

    threshold: require('./threshold')

});

module.exports = thresholdViolationSchema;
