const Mongoose = require('mongoose');

var User = Mongoose.model('User');

module.exports = {

    terrariumThingies: function (request, reply) {
        User.findOne({name: request.auth.credentials.userName})
            .select('terrariums._id ' +
                'terrariums.name ' +
                'terrariums.description ' +
                'terrariums.thingies._id ' +
                'terrariums.thingies.macAddress ' +
                'terrariums.thingies.description')
            .exec(function (err, user) {
                if (err) {
                    console.error(err);
                    return reply({'Error': 'User not found'}).code(404);
                }
                let terra = user.terrariums.id(request.params.terrarium_id);
                if (!terra) {
                    return reply({
                        "Error": "User has no terrarium with the given ID",
                        id: request.params.terrarium_id
                    }).code(404);
                }

                reply(terra).code(200);
        });
    },

    terrariumValues: function (request, reply) {
        User.findOne({name: request.auth.credentials.userName})
            .select("-terrariums.thingies.targetConfiguration -terrariums.thingies.thresholdViolations")
            .exec(function (err, user) {
                var from = request.query.from;
                var to = request.query.to;
                var limit = request.query.limit;
                let terra = user.terrariums.id(request.params.terrarium_id);

                if(!terra){
                    return reply({"Error": "User has no terrarium with the given ID",
                        id: request.params.terrarium_id}).code(404);
                }

                if (err) {
                    console.error(err);
                    return reply({"Error": "User not found"}).code(404);
                }

                if (from && to) {
                    terra.thingies.forEach(function (thingy) {
                        var hums = [];
                        var temps = [];
                        var airQs = [];

                        thingy.airQualities.forEach(function (airQ) {
                            if(airQ.timestamp >= from && airQ.timestamp <= to){
                                airQs.push(airQ);
                            }
                        });

                        thingy.temperatures.forEach(function (temp) {
                            if(temp.timestamp >= from && temp.timestamp <= to){
                                temps.push(temp);
                            }
                        });

                        thingy.humidities.forEach(function (hum) {
                            if(hum.timestamp >= from && hum.timestamp <= to){
                                hums.push(hum);
                            }
                        });

                        thingy.humidities = hums;
                        thingy.temperatures = temps;
                        thingy.airQualities = airQs;

                        if(limit){
                            thingy.airQualities.splice(limit, thingy.airQualities.length - limit);
                            thingy.humidities.splice(limit, thingy.humidities.length - limit);
                            thingy.temperatures.splice(limit, thingy.temperatures.length - limit);
                        }
                    });

                } else {
                    terra.thingies.forEach(function (thingy) {
                        thingy.humidities = thingy.humidities[thingy.humidities.length - 1];
                        thingy.temperatures = thingy.temperatures[thingy.temperatures.length - 1];
                        thingy.airQualities = thingy.airQualities[thingy.airQualities.length - 1];
                    });
                }

                reply(terra).code(200);
        });
    },

    terrariumTemperatures: function (request, reply) {
        User.findOne({name: request.auth.credentials.userName})
            .select('-terrariums.thingies.humidities -terrariums.thingies.airQualities -terrariums.thingies.targetConfiguration -terrariums.thingies.thresholdViolations')
            .exec(function (err, user) {
                var from = request.query.from;
                var to = request.query.to;
                var limit = request.query.limit;
                let terra = user.terrariums.id(request.params.terrarium_id);

                if(!terra){
                    return reply({"Error": "User has no terrarium with the given ID",
                        id: request.params.terrarium_id}).code(404);
                }

                if (err) {
                    console.error(err);
                    return reply({"Error": "User not found"}).code(404);
                }

                if (from && to) {
                    terra.thingies.forEach(function (thingy) {
                        var temps = [];

                        thingy.temperatures.forEach(function (temp) {
                            if(temp.timestamp >= from && temp.timestamp <= to){
                                temps.push(temp);
                            }
                        });

                        thingy.temperatures = temps;

                        if(limit){
                            thingy.temperatures.splice(limit, thingy.temperatures.length - limit);
                        }
                    });

                } else {
                    terra.thingies.forEach(function (thingy) {
                        thingy.temperatures = thingy.temperatures[thingy.temperatures.length - 1];
                    });
                }

                reply(terra).code(200);
        });
    },

    terrariumConfigurations: function (request, reply) {
        User.findOne({name: request.auth.credentials.userName})
            .select('-terrariums.thingies.humidities -terrariums.thingies.airQualities -terrariums.thingies.temperatures -terrariums.thingies.thresholdViolations')
            .exec(function (err, user) {
                if (err) {
                    console.error(err);
                    return reply({'Error': 'User not found'}).code(404);
                }

                let terra = user.terrariums.id(request.params.terrarium_id);
                if (!terra) {
                    return reply({
                        "Error": "User has no terrarium with the given ID",
                        id: request.params.terrarium_id
                    }).code(404);
                }

                reply(terra).code(200);
        });
    },

    terrariumViolations: function (request, reply) {
        User.findOne({name: request.auth.credentials.userName})
            .select('-terrariums.thingies.humidities -terrariums.thingies.airQualities -terrariums.thingies.temperatures -terrariums.thingies.targetConfiguration')
            .exec(function (err, user) {
                if (err) {
                    console.error(err);
                    return reply({'Error': 'User not found'}).code(404);
                }
                let terra = user.terrariums.id(request.params.terrarium_id);
                if (!terra) {
                    return reply({
                        "Error": "User has no terrarium with the given ID",
                        id: request.params.terrarium_id
                    }).code(404);
                }

                reply(user.terrariums.id(request.params.terrarium_id)).code(200);
        });
    },

    terrariumHumidities: function (request, reply) {
        User.findOne({name: request.auth.credentials.userName})
            .select('-terrariums.thingies.temperatures -terrariums.thingies.airQualities -terrariums.thingies.targetConfiguration -terrariums.thingies.thresholdViolations')
            .exec(function (err, user) {
                var from = request.query.from;
                var to = request.query.to;
                var limit = request.query.limit;
                let terra = user.terrariums.id(request.params.terrarium_id);
                if(!terra){
                    return reply({"Error": "User has no terrarium with the given ID",
                        id: request.params.terrarium_id}).code(404);
                }

                if (err) {
                    console.error(err);
                    return reply({"Error": "User not found"}).code(404);
                }

                if (from && to) {
                    terra.thingies.forEach(function (thingy) {
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

                } else {
                    terra.thingies.forEach(function (thingy) {
                        thingy.humidities = thingy.humidities[thingy.humidities.length - 1];
                    });
                }

                reply(terra).code(200);
        });
    },

    terrariumAirqualities: function (request, reply) {
        User.findOne({name: request.auth.credentials.userName})
            .select('-terrariums.thingies.temperatures -terrariums.thingies.humidities -terrariums.thingies.targetConfiguration -terrariums.thingies.thresholdViolations')
            .exec(function (err, user) {
                var from = request.query.from;
                var to = request.query.to;
                var limit = request.query.limit;
                let terra = user.terrariums.id(request.params.terrarium_id);
                if(!terra){
                    return reply({"Error": "User has no terrarium with the given ID",
                        id: request.params.terrarium_id}).code(404);
                }

                if (err) {
                    console.error(err);
                    return reply({"Error": "User not found"}).code(404);
                }

                if (from && to) {
                    terra.thingies.forEach(function (thingy) {
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

                } else {
                    terra.thingies.forEach(function (thingy) {
                        thingy.airQualities = thingy.airQualities[thingy.airQualities.length - 1];
                    });
                }

                reply(terra).code(200);
        });
    }
};
