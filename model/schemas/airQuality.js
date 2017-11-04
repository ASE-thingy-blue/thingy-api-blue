/**
 * Created by Tanja on 26/10/17.
 */

const Mongoose = require('mongoose');

var airQualitySchema = Mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now
    },

    co2: require("./carbondioxide"),

    tvoc: require('./tvoc')

});

module.exports = airQualitySchema;
