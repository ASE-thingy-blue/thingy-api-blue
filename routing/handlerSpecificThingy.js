const Mongoose = require("mongoose");

var User = Mongoose.model("User");

module.exports = {

    thingyDelete: function (request, reply) {
        User.findOne({name: request.auth.credentials.userName})
        .exec(function (err, user) {
            let terra = user.terrariums.id(request.params.terrariumId);
            if (!terra) {
                return reply({
                    "Error": "User has no terrarium with the given ID",
                    id: request.params.terrariumId
                }).code(404);
            }

            let thingy = terra.thingies.id(request.params.thingyId);
            if (!thingy) {
                return reply({
                    "Error": "Terrarium has no Thingy with the given ID",
                    id: request.params.thingyId
                }).code(404);
            }

            if (err) {
                console.error(err);
                return reply({"Error": "User not found"}).code(404);
            }

            terra.thingies.splice(terra.thingies.indexOf(thingy), 1);
            user.save((err) => {
                if (err) {
                    return reply({"message": "Something went wrong! Terrarium not saved"}).code(500);
                }

                return reply({
                    "success": true,
                    message: "Thingy was deleted",
                    id: request.params.terrariumId
                }).code(200);
            });
        });
    },

    thingyValues: function (request, reply) {
        User.findOne({name: request.auth.credentials.userName})
            .select("-terrariums.thingies.targetConfiguration -terrariums.thingies.thresholdViolations")
            .exec(function (err, user) {
                var from = request.query.from;
                var to = request.query.to;
                var limit = request.query.limit;
                let terra = user.terrariums.id(request.params.terrariumId);
                if (!terra) {
                    return reply({"Error": "User has no terrarium with the given ID",
                        id: request.params.terrariumId}).code(404);
                }

                let thingy = terra.thingies.id(request.params.thingyId);
                if (!thingy) {
                    return reply({"Error": "Terrarium has no Thingy with the given ID",
                        id: request.params.thingyId}).code(404);
                }

                if (err) {
                    console.error(err);
                    return reply({"Error": "User not found"}).code(404);
                }

                if (from && to) {
                    var airQs = [];
                    var hums = [];
                    var temps = [];

                    thingy.airQualities.forEach(function (airQ) {
                        if (airQ.timestamp >= from && airQ.timestamp <= to) {
                            airQs.push(airQ);
                        }
                    });

                    thingy.temperatures.forEach(function (temp) {
                        if (temp.timestamp >= from && temp.timestamp <= to) {
                            temps.push(temp);
                        }
                    });

                    thingy.humidities.forEach(function (hum) {
                        if (hum.timestamp >= from && hum.timestamp <= to) {
                            hums.push(hum);
                        }
                    });

                    thingy.airQualities = airQs;
                    thingy.temperatures = temps;
                    thingy.humidities = hums;

                    if (limit) {
                        thingy.airQualities.splice(limit, thingy.airQualities.length - limit);
                        thingy.temperatures.splice(limit, thingy.temperatures.length - limit);
                        thingy.humidities.splice(limit, thingy.humidities.length - limit);
                    }
                } else {
                    thingy.airQualities = thingy.airQualities[thingy.airQualities.length - 1];
                    thingy.temperatures = thingy.temperatures[thingy.temperatures.length - 1];
                    thingy.humidities = thingy.humidities[thingy.humidities.length - 1];
                }

                reply(thingy).code(200);
        });
    },

    thingyConfiguration: function (request, reply) {
        User.findOne({name: request.auth.credentials.userName})
            .select("-terrariums.thingies.humidities -terrariums.thingies.airQualities -terrariums.thingies.temperatures -terrariums.thingies.thresholdViolations")
            .exec(function (err, user) {
                if (err) {
                    console.error(err);
                    return reply({"Error": "User not found"}).code(404);
                } else {
                    let terra = user.terrariums.id(request.params.terrariumId);
                    if (!terra) {
                        return reply({"Error": "User has no terrarium with the given ID",
                            id: request.params.terrariumId}).code(404);
                    }

                    let thingy = terra.thingies.id(request.params.thingyId);
                    if (!thingy) {
                        return reply({"Error": "Terrarium has no Thingy with the given ID",
                            id: request.params.thingyId}).code(404);
                    }

                    reply(thingy).code(200);
                }
        });
    },

    thingyViolations: function (request, reply) {
        User.findOne({name: request.auth.credentials.userName})
            .select("-terrariums.thingies.humidities -terrariums.thingies.airQualities -terrariums.thingies.temperatures -terrariums.thingies.targetConfiguration")
            .exec(function (err, user) {
                if (err) {
                    console.error(err);
                    return reply({"Error": "User not found"}).code(404);
                } else {
                    let terra = user.terrariums.id(request.params.terrariumId);
                    if (!terra) {
                        return reply({"Error": "User has no terrarium with the given ID",
                            id: request.params.terrariumId}).code(404);
                    }

                    let thingy = terra.thingies.id(request.params.thingyId);
                    if (!thingy) {
                        return reply({"Error": "Terrarium has no Thingy with the given ID",
                            id: request.params.thingyId}).code(404);
                    }

                    reply(thingy).code(200);
                }
        });
    },

    thingyTemperature: function (request, reply) {
        User.findOne({name: request.auth.credentials.userName})
            .select("-terrariums.thingies.humidities -terrariums.thingies.airQualities -terrariums.thingies.targetConfiguration -terrariums.thingies.thresholdViolations")
            .exec(function (err, user) {
                var from = request.query.from;
                var to = request.query.to;
                var limit = request.query.limit;
                let terra = user.terrariums.id(request.params.terrariumId);
                if (!terra) {
                    return reply({"Error": "User has no terrarium with the given ID",
                        id: request.params.terrariumId}).code(404);
                }

                let thingy = terra.thingies.id(request.params.thingyId);
                if (!thingy) {
                    return reply({"Error": "Terrarium has no Thingy with the given ID",
                        id: request.params.thingyId}).code(404);
                }

                if (err) {
                    console.error(err);
                    return reply({"Error": "User not found"}).code(404);
                }

                if (from && to) {
                    var temps = [];

                    thingy.temperatures.forEach(function (temp) {
                        if (temp.timestamp >= from && temp.timestamp <= to) {
                            temps.push(temp);
                        }
                    });

                    thingy.temperatures = temps;

                    if (limit) {
                        thingy.temperatures.splice(limit, thingy.temperatures.length - limit);
                    }
                } else {
                    thingy.temperatures = thingy.temperatures[thingy.temperatures.length - 1];
                }

                reply(thingy).code(200);
        });
    },

    thingyHumidity: function (request, reply) {
        User.findOne({name: request.auth.credentials.userName})
            .select("-terrariums.thingies.temperatures -terrariums.thingies.airQualities -terrariums.thingies.targetConfiguration -terrariums.thingies.thresholdViolations")
            .exec(function (err, user) {
                var from = request.query.from;
                var to = request.query.to;
                var limit = request.query.limit;
                let terra = user.terrariums.id(request.params.terrariumId);
                if (!terra) {
                    return reply({"Error": "User has no terrarium with the given ID",
                        id: request.params.terrariumId}).code(404);
                }

                let thingy = terra.thingies.id(request.params.thingyId);
                if (!thingy) {
                    return reply({"Error": "Terrarium has no Thingy with the given ID",
                        id: request.params.thingyId}).code(404);
                }

                if (err) {
                    console.error(err);
                    return reply({"Error": "User not found"}).code(404);
                }

                if (from && to) {
                    var hums = [];

                    thingy.humidities.forEach(function (hum) {
                        if (hum.timestamp >= from && hum.timestamp <= to) {
                            hums.push(hum);
                        }
                    });

                    thingy.humidities = hums;

                    if (limit) {
                        thingy.humidities.splice(limit, thingy.humidities.length - limit);
                    }
                } else {
                    thingy.humidities = thingy.humidities[thingy.humidities.length - 1];
                }

                reply(thingy).code(200);
        });
    },

    thingyAirquality: function (request, reply) {
        User.findOne({name: request.auth.credentials.userName})
            .select("-terrariums.thingies.humidities -terrariums.thingies.temperatures -terrariums.thingies.targetConfiguration -terrariums.thingies.thresholdViolations")
            .exec(function (err, user) {
                var from = request.query.from;
                var to = request.query.to;
                var limit = request.query.limit;
                let terra = user.terrariums.id(request.params.terrariumId);
                if (!terra) {
                    return reply({"Error": "User has no terrarium with the given ID",
                        id: request.params.terrariumId}).code(404);
                }

                let thingy = terra.thingies.id(request.params.thingyId);
                if (!thingy) {
                    return reply({"Error": "Terrarium has no Thingy with the given ID",
                        id: request.params.thingyId}).code(404);
                }

                if (err) {
                    console.error(err);
                    return reply({"Error": "User not found"}).code(404);
                }

                if (from && to) {
                    var airQs = [];

                    thingy.airQualities.forEach(function (airQ) {
                        if (airQ.timestamp >= from && airQ.timestamp <= to) {
                            airQs.push(airQ);
                        }
                    });

                    thingy.airQualities = airQs;

                    if (limit) {
                        thingy.airQualities.splice(limit, thingy.airQualities.length - limit);
                    }
                } else {
                    thingy.airQualities = thingy.airQualities[thingy.airQualities.length - 1];
                }

                reply(thingy).code(200);
        });
    }
};
