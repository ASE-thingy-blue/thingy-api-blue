/**
 * Created by Tanja on 26/10/17.
 */

const Mongoose = require('mongoose');

var temperatureSchema = Mongoose.Schema({
	value : {
		type : Number,
		require : true
	},

	unit : {
		type : Mongoose.Schema.Types.ObjectId,
		ref : 'Unit',
		require : true
	}
});

module.exports = Mongoose.model("Temperature", temperatureSchema);
