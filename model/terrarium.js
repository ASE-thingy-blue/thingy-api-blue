/**
 * Created by Tanja on 26/10/17.
 */

const Mongoose = require('mongoose');
var Thingy = require('./thingy');


var terrariumSchema = Mongoose.Schema({
    name:  {
        type: String,
        require: true},
    description: String,

    thingies: [{
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Thingy'
    }]

});


module.exports = Mongoose.model("Terrarium", terrariumSchema);