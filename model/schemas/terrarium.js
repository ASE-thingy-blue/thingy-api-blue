/**
 * Created by Tanja on 26/10/17.
 */

const Mongoose = require("mongoose");

var terrariumSchema = Mongoose.Schema({
        name: {
            type: String,
            require: true
        },
        description: String,
        callbackAddress: String,
        isDefault: {
            type: Boolean,
            default: false
        },

        thingies: [require("./thingy")]
    });

module.exports = terrariumSchema;
