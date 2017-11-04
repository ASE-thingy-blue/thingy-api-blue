/**
 * Created by Tanja on 26/10/17.
 */

const Mongoose = require('mongoose');

var tvocSchema = Mongoose.Schema({
    value: {
        type: Number,
        require: true
    },

    unit: require('./unit')

});

module.exports = tvocSchema;
