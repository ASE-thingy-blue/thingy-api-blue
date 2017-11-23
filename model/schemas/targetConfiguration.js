const Mongoose = require('mongoose');

/**
 * Models a set of ideal values and a list of ranges. is applied once per thingy
 */
var targetConfigurationSchema = Mongoose.Schema({

    ideal : require('./targetValues'),

    ranges : [ {
	title : String,
	severity : String,
	min : require('./targetValues'),
	max : require('./targetValues')
    } ]

});

module.exports = targetConfigurationSchema;