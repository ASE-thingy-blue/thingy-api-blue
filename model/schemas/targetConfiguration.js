const Mongoose = require('mongoose');

/**
 * Models a set of ideal values and a list thresholds
 */
var targetConfigurationSchema = Mongoose.Schema({

    ideal : require('./targetValues'),

    thresholds : [ {
	title : String,
	severity : String,
	ascending : Boolean,
	
	arm : require('./targetValues'),
	disarm : require('./targetValues')
    } ]

});

module.exports = targetConfigurationSchema;