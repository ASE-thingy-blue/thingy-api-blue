const Mongoose = require('mongoose');

var User = Mongoose.model('User');

module.exports = {

    terrariums: function (request, reply) {
        User.findOne({name: request.auth.credentials.userName})
            .select('terrariums._id terrariums.name terrariums.description')
            .exec(function (err, user) {
                if (err) {
                    console.error(err);
                    return reply({"Error": "User not found"}).code(404);
                } else {
                    reply(user).code(200);
                }
            });
    },

    terrariumsValues: function (request, reply) {
        User.findOne({name: request.auth.credentials.userName})
            .select('-terrariums.thingies.targetConfiguration -terrariums.thingies.thresholdViolations')
            .exec(function (err, user) {
                var from = request.query.from;
                var to = request.query.to;
                var limit = request.query.limit;

                if (err) {
                    console.error(err);
                    return reply({"Error": "User not found"}).code(404);
                }

                if (from && to) {
                    user.terrariums.forEach(function (t) {
                        t.thingies.forEach(function (thingy) {
                            var hums = [];
                            var temps = [];
                            var airQs = [];

                            thingy.humidities.forEach(function (hum) {
                                if(hum.timestamp >= from && hum.timestamp <= to){
                                    hums.push(hum);
                                }
                            });

                            thingy.temperatures.forEach(function (temp) {
                                if(temp.timestamp >= from && temp.timestamp <= to){
                                    temps.push(temp);
                                }
                            });

                            thingy.airQualities.forEach(function (airQ) {
                                if(airQ.timestamp >= from && airQ.timestamp <= to){
                                    airQs.push(airQ);
                                }
                            });

                            thingy.humidities = hums;
                            thingy.temperatures = temps;
                            thingy.airQualities = airQs;

                            if(limit){
                                thingy.humidities.splice(limit, thingy.humidities.length - limit);
                                thingy.temperatures.splice(limit, thingy.temperatures.length-limit);
                                thingy.airQualities.splice(limit, thingy.airQualities.length-limit);
                            }
                        });
                    });

                } else {
                    user.terrariums.forEach(function (t) {
                        t.thingies.forEach(function (thingy) {
                            thingy.humidities = thingy.humidities[thingy.humidities.length - 1];
                            thingy.temperatures = thingy.temperatures[thingy.temperatures.length - 1];
                            thingy.airQualities = thingy.airQualities[thingy.airQualities.length - 1];
                        });
                    });
                }

                reply(user.terrariums).code(200);
        });
    },

    terrariumsConfigurations: function (request, reply) {
        User.findOne({name: request.auth.credentials.userName})
        .select('-terrariums.thingies.humidities -terrariums.thingies.temperatures -terrariums.thingies.airQualities -terrariums.thingies.thresholdViolations')
            .exec(function (err, user) {
                if (err) {
                    console.error(err);
                    return reply({'Error': 'User not found'}).code(404);
                } else {
                    reply(user.terrariums).code(200);
                }
        });
    },

    terrariumsViolations: function (request, reply) {
        User.findOne({name: request.auth.credentials.userName}).select('-terrariums.thingies.humidities -terrariums.thingies.temperatures -terrariums.thingies.airQualities -terrariums.thingies.targetConfiguration')
            .exec(function (err, user) {
                if (err) {
                    console.error(err);
                    return reply({'Error': 'User not found'}).code(404);
                } else {
                    reply(user.terrariums).code(200);
                }
        });
    },

    terrariumsTemperature: function (request, reply) {
        User.findOne({name: request.auth.credentials.userName})
            .select('-terrariums.thingies.humidities -terrariums.thingies.airQualities -terrariums.thingies.targetConfiguration -terrariums.thingies.thresholdViolations')
            .exec(function (err, user) {
                var from = request.query.from;
                var to = request.query.to;
                var limit = request.query.limit;

                if (err) {
                    console.error(err);
                    return reply({"Error": "User not found"}).code(404);
                }

                if (from && to) {
                    user.terrariums.forEach(function (t) {
                        t.thingies.forEach(function (thingy) {
                            var temps = [];

                            thingy.temperatures.forEach(function (temp) {
                                if(temp.timestamp >= from && temp.timestamp <= to){
                                    temps.push(temp);
                                }
                            });

                            thingy.temperatures = temps;

                            if(limit){
                                thingy.temperatures.splice(limit, thingy.temperatures.length-limit);
                            }
                        });
                    });

                } else {
                    user.terrariums.forEach(function (t) {
                        t.thingies.forEach(function (thingy) {
                            thingy.temperatures = thingy.temperatures[thingy.temperatures.length - 1];
                        });
                    });
                }

                reply(user.terrariums).code(200);
        });
    },

    terrariumsHumidity: function (request, reply) {
        User.findOne({name: request.auth.credentials.userName})
            .select('-terrariums.thingies.temperatures -terrariums.thingies.airQualities -terrariums.thingies.targetConfiguration -terrariums.thingies.thresholdViolations')
            .exec(function (err, user) {
                var from = request.query.from;
                var to = request.query.to;
                var limit = request.query.limit;

                if (err) {
                    console.error(err);
                    return reply({"Error": "User not found"}).code(404);
                }

                if (from && to) {
                    user.terrariums.forEach(function (t) {
                        t.thingies.forEach(function (thingy) {
                            var hums = [];

                            thingy.humidities.forEach(function (hum) {
                                if(hum.timestamp >= from && hum.timestamp <= to){
                                    hums.push(hum);
                                }
                            });

                            thingy.humidities = hums;

                            if(limit){
                                thingy.humidities.splice(limit, thingy.humidities.length - limit);
                            }
                        });
                    });

                } else {
                    user.terrariums.forEach(function (t) {
                        t.thingies.forEach(function (thingy) {
                            thingy.humidities = thingy.humidities[thingy.humidities.length - 1];
                        });
                    });
                }

                reply(user.terrariums).code(200);
        });
    },

    terrariumsAirquality: function (request, reply) {
        User.findOne({name: request.auth.credentials.userName})
            .select('-terrariums.thingies.humidities -terrariums.thingies.temperatures -terrariums.thingies.targetConfiguration -terrariums.thingies.thresholdViolations')
            .exec(function (err, user) {
                var from = request.query.from;
                var to = request.query.to;
                var limit = request.query.limit;

                if (err) {
                    console.error(err);
                    return reply({"Error": "User not found"}).code(404);
                }

                if (from && to) {
                    user.terrariums.forEach(function (t) {
                        t.thingies.forEach(function (thingy) {
                            var airQs = [];

                            thingy.airQualities.forEach(function (airQ) {
                                if(airQ.timestamp >= from && airQ.timestamp <= to){
                                    airQs.push(airQ);
                                }
                            });

                            thingy.airQualities = airQs;

                            if(limit){
                                thingy.airQualities.splice(limit, thingy.airQualities.length - limit);
                            }
                        });
                    });

                } else {
                    user.terrariums.forEach(function (t) {
                        t.thingies.forEach(function (thingy) {
                            thingy.airQualities = thingy.airQualities[thingy.airQualities.length - 1];
                        });
                    });
                }

                reply(user.terrariums).code(200);
        });
    }
};
