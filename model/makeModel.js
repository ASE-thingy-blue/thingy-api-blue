const Mongoose = require('mongoose');

var init = function () {
    Mongoose.model('User', require('./schemas/user'));
    Mongoose.model('Terrarium', require('./schemas/terrarium'));
    Mongoose.model('Thingy', require('./schemas/thingy'));
    Mongoose.model('Temperature', require('./schemas/temperature'));
    Mongoose.model('Humidity', require('./schemas/humidity'));
    Mongoose.model('AirQuality', require('./schemas/airQuality'));
    Mongoose.model('Carbondioxide', require('./schemas/carbondioxide'));
    Mongoose.model('TVOC', require('./schemas/tvoc'));
    Mongoose.model('Unit', require('./schemas/unit'));
};

module.exports = init();