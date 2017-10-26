/**
 * Created by Tanja on 26/10/17.
 */

const Mongoose = require('mongoose');
var AirQuality = require('./airQuality');
var Humidity = require('./humidity');
var Temperature = require('./temperature');


var measurementSchema = Mongoose.Schema({
    timestamp: {
        type: Date,
        require: true},

    airQuality: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'AirQuality'
    },

    humidity: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Humidity'
    },

    temperature: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Temperature'
    }

});

module.exports = Mongoose.model("Measurement", measurementSchema);