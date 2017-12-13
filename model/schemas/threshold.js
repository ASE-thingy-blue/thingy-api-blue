const Mongoose = require('mongoose');

var thresholdSchema = Mongoose.Schema({
    title: String,
    severity: String,
    ascending: Boolean,

    arm: require('./targetValues'),
    disarm: require('./targetValues')

// TODO: insert parameters controlling mails
});

module.exports = thresholdSchema;
