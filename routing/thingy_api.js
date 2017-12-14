const Mongoose = require('mongoose');
const Joi = require('joi');

const triggerTools = require('../backend/triggerTools');

const Terri = Mongoose.model('Terrarium');
const Thingy = Mongoose.model('Thingy');
const Temp = Mongoose.model('Temperature');
const Hum = Mongoose.model('Humidity');
const AirQ = Mongoose.model('AirQuality');
const Tvoc = Mongoose.model('TVOC');
const Carbon = Mongoose.model('Carbondioxide');
const User = Mongoose.model('User');
const Unit = Mongoose.model('Unit');

// URL Param Schemes
const thingyIdSchema = Joi.string().required().description('The Thingy UUID');
const sensorIdSchema = Joi.string().required().description('The Thingy Sensor');

/*
 * Reads a unit from the DB by name or creates it if it does not exist
 */
let getOrCreateUnit = (name, short, reply) => {
    let result;
    Unit.find({name: name}, function (err, unit) {
        if (err) {
            console.error(err);
            return reply({'Error': 'Unit not in database'}).code(500);
        }
        if (unit === null) {
            let newUnit = new Unit({name: name, short: short});
            newUnit.save();
            result = newUnit;
        } else {
            result = unit;
        }
        return result;
    });
};

const createThingyAPI = (server) => {
    server.route({
        method: 'PUT',
        path: '/thingy/{thingyId}',
        handler: function (request, reply) {
            let thingyId = request.params.thingyId;
            let data = request.payload;

            User.findOne({name: data.user}, function (err, user) {
                if (err) {
                    console.error(err);
                    reply({'Error': 'Database error'}).code(500);
                } else {
                    if (user === null) {
                        let newUser = new User({name: data.user});
                        let terri = new Terri({name: 'My first terrarium', isDefault: true});
                        let thingy = new Thingy({macAddress: data.thingy, callbackAddress: data.cb});

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
                                let newThingy = new Thingy({macAddress: data.thingy, callbackAddress: data.cb});
                                let terri = new Terri({name: 'My first terrarium', isDefault: true});

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
                    thingyId: thingyIdSchema
                }
            },
            auth: false
        }
    });

    server.route({
        method: 'GET',
        path: '/thingy/{thingyId}/setup',
        handler: function (request, reply) {
            let thingyId = request.params.thingyId;
            console.log('setup');

            let setup = {
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
                    thingyId: thingyIdSchema
                }
            },
            auth: false
        }
    });

    server.route({
        method: 'GET',
        path: '/thingy/{thingyId}/actuators/led',
        handler: function (request, reply) {
            let thingyId = request.params.thingyId;

            //COLORS:
            // 1 - light blue
            // 2 - red
            // 3
            // 4
            // 5
            // 6 - light blue
            // 7
            // 8 - green

            let led = {
                color: 6,
                intensity: 10,
                delay: 3000
            };

            reply(led).code(200);
        },
        config: {
            tags: ['thingy'],
            validate: {
                params: {
                    thingyId: thingyIdSchema
                }
            },
            auth: false
        }
    });

    server.route({
        method: 'POST',
        path: '/thingy/{thingyId}/sensors/{sensorId}',
        handler: function (request, reply) {
            let thingyId = request.params.thingyId;
            let sensorId = request.params.sensorId;

            Thingy.findOne({macAddress: thingyId}, function (err, thingy) {
                if (err) {
                    console.error(err);
                    // Stop execution
                    return reply({
                        'Error': 'This Thingy is not in our database',
                        'thingy': thingyId
                    }).code(404);
                }

                let data = request.payload;

                switch (sensorId) {
                    case 'humidity':
                        let unitPercent = getOrCreateUnit('Percent', '%', reply);

                        let newHmu = new Hum({
                            value: data.humidity,
                            unit: unitPercent,
                            timestamp: data.timestamp
                        });
                        newHmu.save();

                        thingy.humidities.push(newHmu);
                        // TODO: we have no auth!
                        //triggerTools.updateThresholds(thingy, request.auth.credentials.mailAddress);
                        thingy.save();
                        break;
                    case 'temperature':
                        let unitCels = getOrCreateUnit('Celsius', 'C', reply);

                        let newTemp = new Temp({
                            value: data.temperature,
                            unit: unitCels,
                            timestamp: data.timestamp
                        });

                        newTemp.save();
                        thingy.temperatures.push(newTemp);
                        // TODO: we have no auth!
                        // triggerTools.updateThresholds(thingy, request.auth.credentials.mailAddress);
                        thingy.save();
                        break;
                    case 'gas':
                        let unit1Db = getOrCreateUnit('gram per cubic meter', 'g/m3', reply);
                        let unit2Db = getOrCreateUnit('microgram per cubic meter', 'mg/m3', reply);

                        let carb = new Carbon({value: data.gas.eco2, unit: unit1Db});
                        let tvoc = new Tvoc({value: data.gas.tvoc, unit: unit2Db});

                        carb.save();
                        tvoc.save();

                        let newAirQ = new AirQ({co2: carb, tvoc: tvoc});
                        newAirQ.save();

                        thingy.airQualities.push(newAirQ);
                        // TODO: we have no auth!
                        //triggerTools.updateThresholds(thingy, request.auth.credentials.mailAddress);
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
                    thingyId: thingyIdSchema,
                    sensorId: sensorIdSchema
                }
            },
            auth: false
        }
    });
};

module.exports = createThingyAPI;
