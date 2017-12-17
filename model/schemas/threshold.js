const Mongoose = require('mongoose');

var thresholdSchema = Mongoose.Schema({
    severity: String,
    ascending: Boolean,
    sensor: Number, // 0: none, 1: hum, 2: temp, 3: tvoc, 4: co2
    arm: Number
});

module.exports = thresholdSchema;
