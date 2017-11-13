/**
 * Created by Tanja on 26/10/17.
 */

const Mongoose = require('mongoose');

var unitSchema = Mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    short: {
        type: String,
        require: true
    }
});

module.exports = unitSchema;
