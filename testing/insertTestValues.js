/*
 * This file adds dummy entries to the DB.
 * Start it with node {path/to/the/file}. e.g. node testing/insertTestValues.js
 */

const Mongoose = require("mongoose");
const Bluebird = require("bluebird");
var promises = [];

// Load model
require("../model/makeModel");

var Terri = Mongoose.model("Terrarium");
var Thingy = Mongoose.model("Thingy");
var Temp = Mongoose.model("Temperature");
var Hum = Mongoose.model("Humidity");
var AirQ = Mongoose.model("AirQuality");
var Tvoc = Mongoose.model("TVOC");
var Carbon = Mongoose.model("Carbondioxide");
var User = Mongoose.model("User");
var Unit = Mongoose.model("Unit");
var TargetConfiguration = Mongoose.model("TargetConfiguration");
var ThresholdViolation = Mongoose.model("ThresholdViolation");
var Threshold = Mongoose.model("Threshold");

require("../model/helper/databaseConnection");

// Creating units
var celsius = new Unit({name: "Celsius", short: "C"});
var percent = new Unit({name: "Percent", short: "%"});
var gPerQ = new Unit({name: "gram per cubic meter", short: "g/m3"});
var mgPerQ = new Unit({name: "microgram per cubic meter", short: "ug/m3"});
promises.push(celsius.save());
promises.push(percent.save());
promises.push(gPerQ.save());
promises.push(mgPerQ.save());

// Temperature
var temp1 = new Temp({value: 25, unit: celsius, timestamp: new Date("2017-01-01")});
var temp2 = new Temp({value: 26, unit: celsius, timestamp: new Date("2017-01-02")});
var temp3 = new Temp({value: 27, unit: celsius, timestamp: new Date("2017-01-03")});
var temp4 = new Temp({value: 28, unit: celsius, timestamp: new Date("2017-01-04")});
var temp5 = new Temp({value: 29, unit: celsius, timestamp: new Date("2017-01-05")});
var temp6 = new Temp({value: 21, unit: celsius, timestamp: new Date("2017-01-06")});
var temp7 = new Temp({value: 22, unit: celsius, timestamp: new Date("2017-01-07")});
var temp8 = new Temp({value: 23, unit: celsius, timestamp: new Date("2017-01-08")});
var temp9 = new Temp({value: 24, unit: celsius, timestamp: new Date("2017-01-09")});
var temp10 = new Temp({value: 20, unit: celsius, timestamp: new Date("2017-01-10")});
var temp11 = new Temp({value: 19, unit: celsius, timestamp: new Date("2017-01-11")});
var temp12 = new Temp({value: 18, unit: celsius, timestamp: new Date("2017-01-12")});
promises.push(temp1.save());
promises.push(temp2.save());
promises.push(temp3.save());
promises.push(temp4.save());
promises.push(temp5.save());
promises.push(temp6.save());
promises.push(temp7.save());
promises.push(temp8.save());
promises.push(temp9.save());
promises.push(temp10.save());
promises.push(temp11.save());
promises.push(temp12.save());

// Humidity
var hum1 = new Hum({value: 15, unit: percent, timestamp: new Date("2017-01-01")});
var hum2 = new Hum({value: 16, unit: percent, timestamp: new Date("2017-01-02")});
var hum3 = new Hum({value: 17, unit: percent, timestamp: new Date("2017-01-03")});
var hum4 = new Hum({value: 18, unit: percent, timestamp: new Date("2017-01-04")});
var hum5 = new Hum({value: 19, unit: percent, timestamp: new Date("2017-01-05")});
var hum6 = new Hum({value: 20, unit: percent, timestamp: new Date("2017-01-06")});
var hum7 = new Hum({value: 21, unit: percent, timestamp: new Date("2017-01-07")});
var hum8 = new Hum({value: 22, unit: percent, timestamp: new Date("2017-01-08")});
var hum9 = new Hum({value: 23, unit: percent, timestamp: new Date("2017-01-09")});
var hum10 = new Hum({value: 24, unit: percent, timestamp: new Date("2017-01-10")});
var hum11 = new Hum({value: 25, unit: percent, timestamp: new Date("2017-01-11")});
var hum12 = new Hum({value: 26, unit: percent, timestamp: new Date("2017-01-12")});
promises.push(hum1.save());
promises.push(hum2.save());
promises.push(hum3.save());
promises.push(hum4.save());
promises.push(hum5.save());
promises.push(hum6.save());
promises.push(hum7.save());
promises.push(hum8.save());
promises.push(hum9.save());
promises.push(hum10.save());
promises.push(hum11.save());
promises.push(hum12.save());

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
promises.push(co21.save());
promises.push(co22.save());
promises.push(co23.save());
promises.push(co24.save());
promises.push(co25.save());
promises.push(co26.save());
promises.push(co27.save());
promises.push(co28.save());
promises.push(co29.save());
promises.push(co210.save());
promises.push(co211.save());
promises.push(co212.save());

// tvoc
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
var tvoc12 = new Tvoc({value: 2, unit: mgPerQ});
promises.push(tvoc1.save());
promises.push(tvoc2.save());
promises.push(tvoc3.save());
promises.push(tvoc4.save());
promises.push(tvoc5.save());
promises.push(tvoc6.save());
promises.push(tvoc7.save());
promises.push(tvoc8.save());
promises.push(tvoc9.save());
promises.push(tvoc10.save());
promises.push(tvoc11.save());
promises.push(tvoc12.save());

// Air quality
var airQ1 = new AirQ({co2: co21, tvoc: tvoc1, timestamp: new Date("2017-01-01")});
var airQ2 = new AirQ({co2: co22, tvoc: tvoc2, timestamp: new Date("2017-01-02")});
var airQ3 = new AirQ({co2: co23, tvoc: tvoc3, timestamp: new Date("2017-01-03")});
var airQ4 = new AirQ({co2: co24, tvoc: tvoc4, timestamp: new Date("2017-01-04")});
var airQ5 = new AirQ({co2: co25, tvoc: tvoc5, timestamp: new Date("2017-01-05")});
var airQ6 = new AirQ({co2: co26, tvoc: tvoc6, timestamp: new Date("2017-01-06")});
var airQ7 = new AirQ({co2: co27, tvoc: tvoc7, timestamp: new Date("2017-01-07")});
var airQ8 = new AirQ({co2: co28, tvoc: tvoc8, timestamp: new Date("2017-01-08")});
var airQ9 = new AirQ({co2: co29, tvoc: tvoc9, timestamp: new Date("2017-01-09")});
var airQ10 = new AirQ({co2: co210, tvoc: tvoc10, timestamp: new Date("2017-01-10")});
var airQ11 = new AirQ({co2: co211, tvoc: tvoc11, timestamp: new Date("2017-01-11")});
var airQ12 = new AirQ({co2: co212, tvoc: tvoc12, timestamp: new Date("2017-01-12")});
promises.push(airQ1.save());
promises.push(airQ2.save());
promises.push(airQ3.save());
promises.push(airQ4.save());
promises.push(airQ5.save());
promises.push(airQ6.save());
promises.push(airQ7.save());
promises.push(airQ8.save());
promises.push(airQ9.save());
promises.push(airQ10.save());
promises.push(airQ11.save());
promises.push(airQ12.save());

// Thresholds
var threshold1 = new Threshold({severity: "warning", ascending: false, sensor: 1, arm: 40});
var threshold2 = new Threshold({severity: "warning", ascending: true, sensor: 2, arm: 35});
var threshold3 = new Threshold({severity: "severe", ascending: true, sensor: 3, arm: 10});
promises.push(threshold1.save());
promises.push(threshold2.save());
promises.push(threshold3.save());

// TargetConfiguration
var config1 = new TargetConfiguration({title: "default"});
config1.thresholds.push(threshold1);
config1.thresholds.push(threshold2);
config1.thresholds.push(threshold3);
promises.push(config1.save());

var viol1 = new ThresholdViolation({threshold: threshold1});
promises.push(viol1.save());

// Thingy
var thingy1 = new Thingy({macAddress: "d35a51c0de9c", description: "test thingy1", targetConfiguration: config1});
thingy1.temperatures.push(temp1);
thingy1.temperatures.push(temp2);
thingy1.temperatures.push(temp3);
thingy1.airQualities.push(airQ1);
thingy1.airQualities.push(airQ2);
thingy1.airQualities.push(airQ3);
thingy1.humidities.push(hum1);
thingy1.humidities.push(hum2);
thingy1.humidities.push(hum3);
thingy1.thresholdViolations.push(viol1);
promises.push(thingy1.save());

var thingy2 = new Thingy({macAddress: "123", description: "test thingy2"});
thingy2.temperatures.push(temp4);
thingy2.temperatures.push(temp5);
thingy2.temperatures.push(temp6);
thingy2.airQualities.push(airQ4);
thingy2.airQualities.push(airQ5);
thingy2.airQualities.push(airQ6);
thingy2.humidities.push(hum4);
thingy2.humidities.push(hum5);
thingy2.humidities.push(hum6);
promises.push(thingy2.save());

var thingy3 = new Thingy({macAddress: "123", description: "test thingy3"});
thingy3.temperatures.push(temp7);
thingy3.temperatures.push(temp8);
thingy3.temperatures.push(temp9);
thingy3.airQualities.push(airQ7);
thingy3.airQualities.push(airQ8);
thingy3.airQualities.push(airQ9);
thingy3.humidities.push(hum7);
thingy3.humidities.push(hum8);
thingy3.humidities.push(hum9);
promises.push(thingy3.save());

var thingy4 = new Thingy({macAddress: "123", description: "test thingy4"});
thingy4.temperatures.push(temp10);
thingy4.temperatures.push(temp11);
thingy4.temperatures.push(temp12);
thingy4.airQualities.push(airQ10);
thingy4.airQualities.push(airQ11);
thingy4.airQualities.push(airQ12);
thingy4.humidities.push(hum10);
thingy4.humidities.push(hum11);
thingy4.humidities.push(hum12);
promises.push(thingy4.save());

// Terrarium
var terri1 = new Terri({name: "test terri 1"});
terri1.thingies.push(thingy1);
terri1.thingies.push(thingy2);
promises.push(terri1.save());

var terri2 = new Terri({name: "test terri 2"});
terri2.thingies.push(thingy3);
terri2.thingies.push(thingy4);
promises.push(terri2.save());

var terri3 = new Terri({name: "Default terrarium", isDefault: true});
promises.push(terri3.save());

// User
var user = new User({name: "Joe Slowinski", mailAddress: "schlangenman@gmail.com", password: "testpw"});
user.terrariums.push(terri1);
user.terrariums.push(terri2);
user.terrariums.push(terri3);
user.profiles.push(config1);
promises.push(user.save());

Bluebird.all(promises)
    .then(function (results)
    {
        console.log(results);
        console.log("Test values written to database");
        Mongoose.disconnect();
    })
    .catch(function (err)
    {
        console.error(err);
        console.error("Error writing test values to database");
        Mongoose.disconnect();
    });
