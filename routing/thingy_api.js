const Mongoose = require('mongoose');
const Joi = require('joi');

const triggerTools = require('../backend/triggerTools');

var Terri = Mongoose.model('Terrarium');
var Thingy = Mongoose.model('Thingy');
var Temp = Mongoose.model('Temperature');
var Hum = Mongoose.model('Humidity');
var AirQ = Mongoose.model('AirQuality');
var Tvoc = Mongoose.model('TVOC');
var Carbon = Mongoose.model('Carbondioxide');
var User = Mongoose.model('User');
var Unit = Mongoose.model('Unit');

// URL Param Schemes
var thingyIdSchema = Joi.string().required().description('The Thingy UUID');
var sensorIdSchema = Joi.string().required().description('The Thingy Sensor');

/*
 * Reads a unit from the DB by name or creates it if it does not exist
 */
let getOrCreateUnit = (name, short, reply) => {
    var result;
    Unit.find({name: name}, function (err, unit) {
        if (err) {
            console.error(err);
            return reply({"Error": "Unit not in database"}).code(500);
        }
        if (unit === null) {
            var newUnit = new Unit({name: name, short: short});
            newUnit.save();
            result = newUnit;
        } else {
            result = unit;
        }
        return result;
    });
};

var createThingyAPI = (server) => {
        server.route({
        method: 'GET',
        path: '/thingy/{thingy_id}/setup',
        handler: function (request, reply) {
            var thingyId = request.params.thingy_id;

            // TODO: Get configuration from server by Thingy ID
            var setup = {
                temperature: {
                    interval: 5000
                },
                pressure: {
                    interval: 5000
                },
                humidity: {
                    interval: 5000
                },
                color: {
                    interval: 5000
                },
                gas: {
                    mode: 3
                }
            };

            reply(setup).code(200);
        },
        config: {
            tags: ['thingy'],
            validate: {
                params: {
                    thingy_id: thingyIdSchema
                }
            }
        }
    });

    server.route({
        method: 'PUT',
        path: '/thingy/{thingy_id}',
        handler: function (request, reply) {
            var thingyId = request.params.thingy_id;
            var data = request.payload;

            User.findOne({name: data.user}, function (err, user) {
                if (err) {
                    console.error(err);
                    reply({'Error': 'Database error'}).code(500);
                } else {
                    if (user === null) {
                        console.log('Create new user');
                        var newUser = new User({name: data.user});
                        var terri = new Terri({name: "My first terrarium"});
                        var thingy = new Thingy({macAddress: data.thingy, callbackAddress: data.cb});

                        newUser.save();
                        terri.save();
                        thingy.save();

                        terri.thingies.push(thingy);
                        newUser.terrariums.push(terri);
                        user = newUser;
                    } else {
                        Thingy.findOne({macAddress: thingyId}, function (err, thingy) {
                            if (err) {
                                console.error(err);
                                return reply({'Error': 'Database error'}).code(500);
                            }
                            if (thingy === null) {
                                console.log('Create a new Thingy');
                                var newThingy = new Thingy({macAddress: data.thingy, callbackAddress: data.cb});
                                var terri = new Terri({name: "My first terrarium"});

                                newThingy.save();
                                terri.thingies.push(newThingy);

                                terri.save();
                                user.terrariums.push(terri);

                                user.save();
                            }
                        });
                    }
                }
            });

            reply({success: true}).code(200);
        },
        config: {
            tags: ['thingy'],
            validate: {
                params: {
                    thingy_id: thingyIdSchema
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/thingy/{thingy_id}/actuators/led',
        handler: function (request, reply) {
            var thingyId = request.params.thingy_id;

            // TODO: Get configuration from server by Thingy ID
            var led = {
                color: 8,
                intensity: 20,
                delay: 1
            };

            reply(led).code(200);
        },
        config: {
            tags: ['thingy'],
            validate: {
                params: {
                    thingy_id: thingyIdSchema
                }
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/thingy/{thingy_id}/sensors/{sensor_id}',
        handler: function (request, reply) {
            var thingyId = request.params.thingy_id;
            var sensorId = request.params.sensor_id;

            Thingy.findOne({macAddress: thingyId}, function (err, thingy) {
                if (err) {
                    console.error(err);
                    // Stop execution
                    return reply({
                        "Error": "This Thingy is not in our database",
                        "thingy": thingyId
                    }).code(404);
                }

                var data = request.payload;

                switch (sensorId) {
                    case 'humidity':
                        var unitPercent = getOrCreateUnit("Percent", "%", reply);

                        var newHmu = new Hum({
                            value: data.humidity,
                            unit: unitPercent,
                            timestamp: data.timestamp
                        });
                        newHmu.save();

                        thingy.humidities.push(newHmu);
                        triggerTools.updateThresholds(thingy);
                        thingy.save();
                        break;
                    case 'temperature':
                        var unitCels = getOrCreateUnit("Celsius", "C", reply);

                        var newTemp = new Temp({
                            value: data.temperature,
                            unit: unitCels,
                            timestamp: data.timestamp
                        });

                        newTemp.save();
                        thingy.temperatures.push(newTemp);
                        triggerTools.updateThresholds(thingy);
                        thingy.save();
                        break;
                    case 'gas':
                        var unit1Db = getOrCreateUnit("gram per cubic meter", "g/m3", reply);
                        var unit2Db = getOrCreateUnit("microgram per cubic meter", "mg/m3", reply);
                        
                        var carb = new Carbon({value: data.gas.eco2, unit: unit1Db});
                        var tvoc = new Tvoc({value: data.gas.tvoc, unit: unit2Db});

                        carb.save();
                        tvoc.save();

                        var newAirQ = new AirQ({co2: carb, tvoc: tvoc});
                        newAirQ.save();

                        thingy.airQualities.push(newAirQ);
                        triggerTools.updateThresholds(thingy);
                        thingy.save();
                        break;
                }
            });

            reply({success: true}).code(200);
        },
        config: {
            tags: ['thingy'],
            validate: {
                params: {
                    thingy_id: thingyIdSchema,
                    sensor_id: sensorIdSchema
                }
            }
        }
    });
};

module.exports = createThingyAPI;
