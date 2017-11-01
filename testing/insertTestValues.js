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
var temp1 = new Temp({value: 25, unit: celsius, timestamp: new Date()});
var temp2 = new Temp({value: 26, unit: celsius, timestamp: new Date()});
var temp3 = new Temp({value: 27, unit: celsius, timestamp: new Date()});
var temp4 = new Temp({value: 28, unit: celsius, timestamp: new Date()});
var temp5 = new Temp({value: 29, unit: celsius, timestamp: new Date()});
var temp6 = new Temp({value: 21, unit: celsius, timestamp: new Date()});
var temp7 = new Temp({value: 22, unit: celsius, timestamp: new Date()});
var temp8 = new Temp({value: 23, unit: celsius, timestamp: new Date()});
var temp9 = new Temp({value: 24, unit: celsius, timestamp: new Date()});
var temp10 = new Temp({value: 20, unit: celsius, timestamp: new Date()});
var temp11 = new Temp({value: 19, unit: celsius, timestamp: new Date()});
var temp12 = new Temp({value: 18, unit: celsius, timestamp: new Date()});
temp1.save();
temp2.save();
temp3.save();
temp4.save();
temp5.save();
temp6.save();
temp7.save();
temp8.save();
temp9.save();
temp10.save();
temp11.save();
temp12.save();

// Humidity
var hum1 = new Hum({value: 15, unit: percent, timestamp: new Date()});
var hum2 = new Hum({value: 16, unit: percent, timestamp: new Date()});
var hum3 = new Hum({value: 17, unit: percent, timestamp: new Date()});
var hum4 = new Hum({value: 18, unit: percent, timestamp: new Date()});
var hum5 = new Hum({value: 19, unit: percent, timestamp: new Date()});
var hum6 = new Hum({value: 20, unit: percent, timestamp: new Date()});
var hum7 = new Hum({value: 21, unit: percent, timestamp: new Date()});
var hum8 = new Hum({value: 22, unit: percent, timestamp: new Date()});
var hum9 = new Hum({value: 23, unit: percent, timestamp: new Date()});
var hum10 = new Hum({value: 24, unit: percent, timestamp: new Date()});
var hum11 = new Hum({value: 25, unit: percent, timestamp: new Date()});
var hum12 = new Hum({value: 26, unit: percent, timestamp: new Date()});
hum1.save();
hum2.save();
hum3.save();
hum4.save();
hum5.save();
hum6.save();
hum7.save();
hum8.save();
hum9.save();
hum10.save();
hum11.save();
hum12.save();

// Carbondioxide (CO2)
var co21 = new Carbon({value: 2, unit: gPerQ});
var co22 = new Carbon({value: 2, unit: gPerQ});
var co23 = new Carbon({value: 2, unit: gPerQ});
var co24 = new Carbon({value: 2, unit: gPerQ});
var co25 = new Carbon({value: 2, unit: gPerQ});
var co26 = new Carbon({value: 2, unit: gPerQ});
var co27 = new Carbon({value: 2, unit: gPerQ});
var co28 = new Carbon({value: 2, unit: gPerQ});
var co29 = new Carbon({value: 2, unit: gPerQ});
var co210 = new Carbon({value: 2, unit: gPerQ});
var co211 = new Carbon({value: 2, unit: gPerQ});
var co212 = new Carbon({value: 2, unit: gPerQ});
co21.save();
co22.save();
co23.save();
co24.save();
co25.save();
co26.save();
co27.save();
co28.save();
co29.save();
co210.save();
co211.save();
co212.save();

//tvoc
var tvoc1 = new Tvoc({value: 2, unit: mgPerQ});
var tvoc2 = new Tvoc({value: 2, unit: mgPerQ});
var tvoc3 = new Tvoc({value: 2, unit: mgPerQ});
var tvoc4 = new Tvoc({value: 2, unit: mgPerQ});
var tvoc5 = new Tvoc({value: 2, unit: mgPerQ});
var tvoc6 = new Tvoc({value: 2, unit: mgPerQ});
var tvoc7 = new Tvoc({value: 2, unit: mgPerQ});
var tvoc8 = new Tvoc({value: 2, unit: mgPerQ});
var tvoc9 = new Tvoc({value: 2, unit: mgPerQ});
var tvoc10 = new Tvoc({value: 2, unit: mgPerQ});
var tvoc11 = new Tvoc({value: 2, unit: mgPerQ});
var tvoc12= new Tvoc({value: 2, unit: mgPerQ});
tvoc1.save();
tvoc2.save();
tvoc3.save();
tvoc4.save();
tvoc5.save();
tvoc6.save();
tvoc7.save();
tvoc8.save();
tvoc9.save();
tvoc10.save();
tvoc11.save();
tvoc12.save();

// Air quality
var airQ1 = new AirQ({co2: co21, tvoc: tvoc1});
var airQ2 = new AirQ({co2: co22, tvoc: tvoc2});
var airQ3 = new AirQ({co2: co23, tvoc: tvoc3});
var airQ4 = new AirQ({co2: co24, tvoc: tvoc4});
var airQ5 = new AirQ({co2: co25, tvoc: tvoc5});
var airQ6 = new AirQ({co2: co26, tvoc: tvoc6});
var airQ7 = new AirQ({co2: co27, tvoc: tvoc7});
var airQ8 = new AirQ({co2: co28, tvoc: tvoc8});
var airQ9 = new AirQ({co2: co29, tvoc: tvoc9});
var airQ10 = new AirQ({co2: co210, tvoc: tvoc10});
var airQ11 = new AirQ({co2: co211, tvoc: tvoc11});
var airQ12 = new AirQ({co2: co212, tvoc: tvoc12});
airQ1.save();
airQ2.save();
airQ3.save();
airQ4.save();
airQ5.save();
airQ6.save();
airQ7.save();
airQ8.save();
airQ9.save();
airQ10.save();
airQ11.save();
airQ12.save();

// Thingy
var thingy1 = new Thingy({macAddress: "123", description: "test thingy"});
thingy1.temperatures.push(temp1);
thingy1.temperatures.push(temp2);
thingy1.temperatures.push(temp3);
thingy1.airQualities.push(airQ1);
thingy1.airQualities.push(airQ2);
thingy1.airQualities.push(airQ3);
thingy1.humidities.push(hum1);
thingy1.humidities.push(hum2);
thingy1.humidities.push(hum3);
thingy1.save();

var thingy2 = new Thingy({macAddress: "123", description: "test thingy"});
thingy2.temperatures.push(temp4);
thingy2.temperatures.push(temp5);
thingy2.temperatures.push(temp6);
thingy2.airQualities.push(airQ4);
thingy2.airQualities.push(airQ5);
thingy2.airQualities.push(airQ6);
thingy2.humidities.push(hum4);
thingy2.humidities.push(hum5);
thingy2.humidities.push(hum6);
thingy2.save();

var thingy3 = new Thingy({macAddress: "123", description: "test thingy"});
thingy3.temperatures.push(temp7);
thingy3.temperatures.push(temp8);
thingy3.temperatures.push(temp9);
thingy3.airQualities.push(airQ7);
thingy3.airQualities.push(airQ8);
thingy3.airQualities.push(airQ9);
thingy3.humidities.push(hum7);
thingy3.humidities.push(hum8);
thingy3.humidities.push(hum9);
thingy3.save();

var thingy4 = new Thingy({macAddress: "123", description: "test thingy"});
thingy4.temperatures.push(temp10);
thingy4.temperatures.push(temp11);
thingy4.temperatures.push(temp12);
thingy4.airQualities.push(airQ10);
thingy4.airQualities.push(airQ11);
thingy4.airQualities.push(airQ12);
thingy4.humidities.push(hum10);
thingy4.humidities.push(hum11);
thingy4.humidities.push(hum12);
thingy4.save();

// Terrarium
var terri1 = new Terri({name: "test terri 1"});
terri1.thingies.push(thingy1);
terri1.thingies.push(thingy2);
terri1.save();

var terri2 = new Terri({name: "test terri 2"});
terri2.thingies.push(thingy3);
terri2.thingies.push(thingy4);
terri2.save();

// User
var user = new User({name: "Joe Slowinski", mailAddress: "schlangenman@gmail.com"});
user.terrariums.push(terri1);
user.terrariums.push(terri2);
user.save();
