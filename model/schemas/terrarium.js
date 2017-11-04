/**
 * Created by Tanja on 26/10/17.
 */

const Mongoose = require('mongoose');

var terrariumSchema = Mongoose.Schema({
        name: {
            type: String,
            require: true
        },
        description: String,

        thingies: [require("./thingy")]
    });

module.exports = terrariumSchema;
