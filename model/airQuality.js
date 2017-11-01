/**
 * Created by Tanja on 26/10/17.
 */

const Mongoose = require('mongoose');

var airQualitySchema = Mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now
    },

    co2: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Carbondioxide',
        require: true
    },

    tvoc: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'TVOC',
        require: true
    }

});

module.exports = Mongoose.model("AirQuality", airQualitySchema);
