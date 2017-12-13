const Mongoose = require('mongoose');

/**
 * Models a set of ideal values and a list thresholds
 */
var targetConfigurationSchema = Mongoose.Schema({

    // title is required to store configuration as a profile (profiles are stored in the user)
    title: String,
    ideal: require('./targetValues'),
    thresholds: [ require('./threshold') ]

});

module.exports = targetConfigurationSchema;
