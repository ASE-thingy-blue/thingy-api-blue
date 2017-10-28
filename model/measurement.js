/**
 * Created by Tanja on 26/10/17.
 */

const Mongoose = require('mongoose');

var measurementSchema = Mongoose.Schema(
{
	timestamp :
	{
		type : Date,
		default : Date.now
	},

	airQuality:
	{
		type : Mongoose.Schema.Types.ObjectId,
		ref : 'AirQuality'
	},

	humidity:
	{
		type : Mongoose.Schema.Types.ObjectId,
		ref : 'Humidity'
	},

	temperature:
	{
		type : Mongoose.Schema.Types.ObjectId,
		ref : 'Temperature'
	}
});

module.exports = Mongoose.model("Measurement", measurementSchema);
