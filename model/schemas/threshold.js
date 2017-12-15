const Mongoose = require('mongoose');

var thresholdSchema = Mongoose.Schema({
    title: String,
    severity: String,
    ascending: Boolean,
    sensor: Number, // 0: none, 1: hum, 2: temp, 3: tvoc, 4: co2

    arm: require('./targetValues'),
    disarm: require('./targetValues')

// TODO: insert parameters controlling mails
});

module.exports = thresholdSchema;
