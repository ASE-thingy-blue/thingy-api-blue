const Mongoose = require('mongoose');

/**
 * Models a set of ideal values and a list thresholds
 */
var targetConfigurationSchema = Mongoose.Schema({

    ideal : require('./targetValues'),

    thresholds : [ require('./threshold') ]

});

module.exports = targetConfigurationSchema;