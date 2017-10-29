/*
 * This files adds dummy entries into the db.
 * start it with node {path/to/the/file}. e.g. node testing/insertTestValues.js
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

//creating units
var celsius = new Unit({name: "Celsius", short: "C"});
var percent = new Unit({name: "Percent", short: "%"});
var gPerQ = new Unit({name: "gram per qubic meter", short: "g/m3"});

celsius.save();
percent.save();
gPerQ.save();

//temp
var temp = new Temp({value: 25, unit: celsius});
temp.save();

//hum
var hum = new Hum({value: 15, unit: percent});
hum.save();

//co2
var co2 = new Carbon({value: 2, unit: gPerQ});
co2.save();

//airq
var airQ = new AirQ({co2: co2});
airQ.save();

//measure
var measure = new Measurement({airQuality: airQ, temperature: temp, humidity: hum});
measure.save();

//thingy
var thingy = new Thingy({macAddress: "123", description: "test thingy"});
thingy.measurements.push(measure);
thingy.save();

//terri
var terri = new Terri({name: "test terri"});
terri.thingies.push(thingy);
terri.save();

//user
var user = new User({name: "Joe Slowinski", mailAddress: "schlangenman@gmail.com"});
user.terrariums.push(terri);
user.save();
