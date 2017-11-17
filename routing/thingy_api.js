const Mongoose = require('mongoose');
const Joi = require('joi');

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
                    reply({'error': 'Database error'}).code(500)
                } else {
                    if (user === null) {
                        console.log('create new user');
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
                        Thingy.findOne({_id: thingyId}, function (err, thingy) {
                            if (thingy === null) {
                                console.log('create new thingy');
                                var newThingy = new Thingy({macAddress: data.thingy, callbackAddress: data.cb});
                                var terri = new Terri({name: "My first terrarium"});

                                newThingy.save();
                                terri.thingies.push(newThingy);

                                terri.save();
                                user.terrariums.push(terri);

                                user.save();
                            }
                        })
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

    server.route(
        {
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
                    reply({
                        "error": "This Thingy is not in our database",
                        "thingy": thingyId
                    }).code(404);
                    //stop execution
                }

                var data = request.payload;

                switch (sensorId) {
                    case 'humidity':
                        var unit_percent;
                        Unit.find({name: "Percent"}, function (err, unit) {
                            if (err) {
                                reply({"error": "Unit not in database"}).code(404);
                            } else {
                                if (unit === null) {
                                    var newUnit = new Unit({name: "Percent", short: "%"});
                                    newUnit.save();
                                    unit_percent = newUnit;
                                } else {
                                    unit_percent = unit;
                                }
                            }
                        });

                        var newHmu = new Hum({
                            value: data.humidity,
                            unit: unit_percent,
                            timestamp: data.timestamp
                        });
                        newHmu.save();

                        thingy.humidities.push(newHmu);
                        thingy.save();
                        break;
                    case 'temperature':
                        var unit_cels;
                        Unit.find({name: "Celsius"}, function (err, unit) {
                            if (err) {
                                reply({"error": "Unit not in database"}).code(404);
                            } else {
                                if (unit === null) {
                                    var newUnit = new Unit({name: "Celsius", short: "C"});
                                    newUnit.save();
                                    unit_cels = newUnit;
                                } else {
                                    unit_cels = unit;
                                }
                            }
                        });

                        var newTemp = new Temp({
                            value: data.temperature,
                            unit: unit_cels,
                            timestamp: data.timestamp
                        });

                        newTemp.save();
                        thingy.temperatures.push(newTemp);
                        thingy.save();
                        break;
                    case 'gas':
                        var unit1_db;
                        var unit2_db;
                        Unit.find({name: "gram per qubic meter"}, function (err, unit) {
                            if (err) {
                                reply({"error": "Unit not in database"}).code(404);
                            } else {
                                if (unit === null) {
                                    var newUnit = new Unit({name: "gram per qubic meter", short: "g/qm"});
                                    newUnit.save();
                                    unit1_db = newUnit;
                                } else {
                                    unit1_db = unit;
                                }
                            }
                        });
                        Unit.find({name: "microgram per qubic meter"}, function (err, unit) {
                            if (err) {
                                reply({"error": "Unit not in database"}).code(404);
                            } else {
                                if (unit === null) {
                                    var newUnit = new Unit({name: "microgram per qubic meter", short: "mg/qm"});
                                    newUnit.save();
                                    unit2_db = newUnit;
                                } else {
                                    unit2_db = unit;
                                }
                            }
                        });

                        var carb = new Carbon({value: data.gas.eco2, unit: unit1_db});
                        var tvoc = new Tvoc({value: data.gas.tvoc, unit: unit2_db});

                        carb.save();
                        tvoc.save();

                        var newAirQ = new AirQ({co2: carb, tvoc: tvoc});
                        newAirQ.save();

                        thingy.airQualities.push(newAirQ);
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
}

module.exports = createThingyAPI;