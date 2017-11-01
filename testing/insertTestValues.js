/*
 * This files adds dummy entries into the DB.
 * Start it with node {path/to/the/file}. e.g. node testing/insertTestValues.js
 */

const Mongoose = require('mongoose');

var Terri = require("../model/Terrarium");
var Thingy = require("../model/Thingy");
var Temp = require("../model/Temperature");
var Hum = require("../model/Humidity");
var AirQ = require("../model/AirQuality");
var Tvoc = require("../model/tvoc");
var Carbon = require("../model/carbondioxide");
var User = require("../model/user");

var Unit = require("../model/Unit");

require("../model/helper/databaseConnection");

// Creating units
var celsius = new Unit({name: "Celsius", short: "C"});
var percent = new Unit({name: "Percent", short: "%"});
var gPerQ = new Unit({name: "gram per qubic meter", short: "g/m3"});
var mgPerQ = new Unit({name: "microgram per qubic meter", short: "ug/m3"});

celsius.save();
percent.save();
gPerQ.save();
mgPerQ.save();

// Temperature
var temp = new Temp({value: 25, unit: celsius, timestamp: new Date()});
temp.save();

// Humidity
var hum = new Hum({value: 15, unit: percent, timestamp: new Date()});
hum.save();

// Carbondioxide (CO2)
var co2 = new Carbon({value: 2, unit: gPerQ});
co2.save();

//tvoc
var tvoc = new Tvoc({value: 2, unit: mgPerQ});
tvoc.save();

// Air quality
var airQ = new AirQ({co2: co2, tvoc: tvoc});
airQ.save();

// Thingy
var thingy = new Thingy({macAddress: "123", description: "test thingy"});
thingy.temperatures.push(temp);
thingy.airQualities.push(airQ);
thingy.humidities.push(hum);
thingy.save();

// Terrarium
var terri = new Terri({name: "test terri"});
terri.thingies.push(thingy);
terri.save();

// User
var user = new User({name: "Joe Slowinski", mailAddress: "schlangenman@gmail.com"});
user.terrariums.push(terri);
user.save();
