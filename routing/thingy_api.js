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
                        let terri = new Terri({name: 'Default terrarium', isDefault: true});
                        let thingy = new Thingy({macAddress: data.thingy, callbackAddress: data.cb});

                        terri.thingies.push(thingy);
                        newUser.terrariums.push(terri);
                        user = newUser;

                        newUser.save();
                        terri.save();
                        thingy.save();
                    } else {
                        Thingy.findOne({macAddress: thingyId}, function (err, thingy) {
                            if (err) {
                                console.error(err);
                                return reply({'Error': 'Database error'}).code(500);
                            }
                            if (thingy === null) {
                                let newThingy = new Thingy({macAddress: data.thingy, callbackAddress: data.cb});
                                user.terrariums.forEach((terra) =>{
                                    if(terra.isDefault){
                                        terra.thingies.push(newThingy);
                                        user.save();
                                    }
                                });
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

            let setup = {
                temperature: {
                    interval: 15000
                },
                pressure: {
                    interval: 15000
                },
                humidity: {
                    interval: 15000
                },
                color: {
                    interval: 15000
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
            // 1 - red
            // 2 - light green
            // 3 - yellow
            // 4 - blue
            // 5 - violet
            // 6 - light blue
            // 7 - white

            let led = {
                color: 2,
                intensity: 10,
                delay: 2000
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

            Terri.findOne()
                .where({'thingies': {$elemMatch: {macAddress: thingyId}}})
                .exec(function (err, terra) {
                    if (err) {
                        return reply({
                            'Error': 'We have a problem.'
                        }).code(500);
                    }

                    if (!terra) {
                        return reply({
                            'Error': 'This Thingy is not in our database',
                            'thingy': thingyId
                        }).code(404);
                    }

                    User.findOne()
                        .where({'terrariums': {$elemMatch: {_id: terra._id}}})
                        .exec(function (err, user) {
                            let uTerri = user.terrariums.id(terra.id);
                            let uthingy = uTerri.thingies.find(function(elem) {
                                return elem.macAddress === thingyId;
                            });

                            let data = request.payload;

                            switch (sensorId) {
                                case 'humidity':
                                    let unitPercent = getOrCreateUnit('Percent', '%', reply);

                                    let newHmu = new Hum({
                                        value: data.humidity,
                                        unit: unitPercent,
                                        timestamp: new Date(data.timestamp).toISOString()
                                    });
                                    newHmu.save();

                                    uthingy.humidities.push(newHmu);
                                    triggerTools.updateThresholds(uthingy, user.mailAddress);
                                    user.save();
                                    break;
                                case 'temperature':
                                    let unitCels = getOrCreateUnit('Celsius', 'C', reply);

                                    let newTemp = new Temp({
                                        value: data.temperature,
                                        unit: unitCels,
                                        timestamp: new Date(data.timestamp).toISOString()
                                    });

                                    newTemp.save();
                                    uthingy.temperatures.push(newTemp);
                                    triggerTools.updateThresholds(uthingy, user.mailAddress);
                                    user.save();
                                    break;
                                case 'gas':
                                    let unit1Db = getOrCreateUnit('gram per cubic meter', 'g/m3', reply);
                                    let unit2Db = getOrCreateUnit('microgram per cubic meter', 'mg/m3', reply);

                                    let carb = new Carbon({value: data.gas.eco2, unit: unit1Db});
                                    let tvoc = new Tvoc({value: data.gas.tvoc, unit: unit2Db});

                                    carb.save();
                                    tvoc.save();

                                    let newAirQ = new AirQ({
                                        co2: carb,
                                        tvoc: tvoc,
                                        timestamp: new Date(data.timestamp).toISOString()
                                    });
                                    newAirQ.save();

                                    uthingy.airQualities.push(newAirQ);
                                    triggerTools.updateThresholds(uthingy, user.mailAddress);
                                    user.save();
                                    break;
                            }
                            reply({success: true}).code(200);
                        });
                });
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
