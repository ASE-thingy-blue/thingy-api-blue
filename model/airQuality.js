/**
 * Created by Tanja on 26/10/17.
 */

const Mongoose = require('mongoose');

// We do not know yet what kind of VOC we can measure
var airQualitySchema = Mongoose.Schema(
{
	co2 :
	{
		type : Mongoose.Schema.Types.ObjectId,
		ref : 'Carbondioxide',
		require : true
	}
});

module.exports = Mongoose.model("AirQuality", airQualitySchema);
