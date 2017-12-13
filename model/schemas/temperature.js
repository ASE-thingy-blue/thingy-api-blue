/**
 * Created by Tanja on 26/10/17.
 */

const Mongoose = require('mongoose');

var temperatureSchema = Mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now
    },

    value: {
        type: Number,
        require: true
    },

    unit: require('./unit')

});

module.exports = temperatureSchema;
