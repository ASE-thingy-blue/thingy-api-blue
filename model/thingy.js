/**
 * Created by Tanja on 26/10/17.
 */

const Mongoose = require('mongoose');

var thingySchema = Mongoose.Schema({
    macAddress: {
        type: String,
        require: true
    },
    description: String,

    temperatures: [{
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Temperature'
    }],

    airQualities: [{
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'AirQuality'
    }],

    humidities: [{
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Humidity'
    }]

});

module.exports = Mongoose.model("Thingy", thingySchema);
