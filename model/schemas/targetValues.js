const Mongoose = require('mongoose');

/**
 * Models a single target value set. this is used for ideal values as well as
 * arming-/disarming points for thresholds
 */
var targetValuesSchema = Mongoose.Schema({

    temperature : {
	value : {
	    type : Number,
	    require : true
	},
	unit : require('./unit')
    },

    humidity : {
	value : {
	    type : Number,
	    require : true
	},
	unit : require('./unit')
    },
    co2 : {
	value : {
	    type : Number,
	    require : true
	},
	unit : require('./unit')
    },
    tvoc : {
	value : {
	    type : Number,
	    require : true
	},
	unit : require('./unit')
    },

});

module.exports = targetValuesSchema;