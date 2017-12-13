/**
 * Created by Tanja on 26/10/17.
 */

const Mongoose = require("mongoose");

var thingySchema = Mongoose.Schema({
    macAddress: {
        type: String,
        require: true
    },
    description: String,

    temperatures: [ require("./temperature") ],

    airQualities: [ require("./airQuality") ],

    humidities: [ require("./humidity") ],

    targetConfiguration: require("./targetConfiguration"),
    thresholdViolations: [ require("./thresholdViolation") ]

});

module.exports = thingySchema;
