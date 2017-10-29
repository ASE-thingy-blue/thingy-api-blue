/*
 * This files adds dummy entries into the DB.
 * Start it with node {path/to/the/file}. e.g. node testing/insertTestValues.js
 */

const Mongoose = require('mongoose');

var Terri = require("../model/Terrarium");
var Thingy = require("../model/Thingy");
var Measurement = require("../model/Measurement");
var Temp = require("../model/Temperature");
var Hum = require("../model/Humidity");
var AirQ = require("../model/AirQuality");
var Carbon = require("../model/carbondioxide");
var User = require("../model/user");

var Unit = require("../model/Unit");

require("../model/helper/databaseConnection");

// Creating units
var celsius = new Unit({name: "Celsius", short: "C"});
var percent = new Unit({name: "Percent", short: "%"});
var gPerQ = new Unit({name: "gram per qubic meter", short: "g/m3"});

celsius.save();
percent.save();
gPerQ.save();

// Temperature
var temp = new Temp({value: 25, unit: celsius});
temp.save();

// Humidity
var hum = new Hum({value: 15, unit: percent});
hum.save();

// Carbondioxide (CO2)
var co2 = new Carbon({value: 2, unit: gPerQ});
co2.save();

// Air quality
var airQ = new AirQ({co2: co2});
airQ.save();

// Measurements
var measure = new Measurement({airQuality: airQ, temperature: temp, humidity: hum});
measure.save();

// Thingy
var thingy = new Thingy({macAddress: "123", description: "test thingy"});
thingy.measurements.push(measure);
thingy.save();

// Terrarium
var terri = new Terri({name: "test terri"});
terri.thingies.push(thingy);
terri.save();

// User
var user = new User({name: "Joe Slowinski", mailAddress: "schlangenman@gmail.com"});
user.terrariums.push(terri);
user.save();
