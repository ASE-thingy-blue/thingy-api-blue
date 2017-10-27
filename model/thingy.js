/**
 * Created by Tanja on 26/10/17.
 */

const Mongoose = require('mongoose');

var thingySchema = Mongoose.Schema({
    macAddress:  {
        type: String,
        require: true},
    description: String,

    measurements: [{
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Measurement'
    }
    ]

});

module.exports = Mongoose.model("Thingy", thingySchema);