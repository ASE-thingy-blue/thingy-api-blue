const Mongoose = require('mongoose');

/**
 * Models a set of ideal values and a list of thresholds
 */
var targetConfigurationSchema = Mongoose.Schema({

    // Title is required to store configuration as a profile (profiles are stored in the user)
    title: String,
    thresholds: [ require('./threshold') ]

});

module.exports = targetConfigurationSchema;
