const Mongoose = require("mongoose");

var User = Mongoose.model("User");
let Terrarium = Mongoose.model("Terrarium");

module.exports = {

    terrariumCreate: (request, reply) => {
        User.findOne({name: request.auth.credentials.userName})
            .exec((err, user) => {
            if (err) {
                console.error(err);
                return reply({"message": "User not found"}).code(404);
            }

            let terraNew = new Terrarium({
                name: request.payload.name,
                description: request.payload.description,
                callbackAddress: request.payload.callbackAddress});

            terraNew.save((err, terri) => {
                if (err) {
                    return reply({"message": "Something went wrong! Terrarium not saved"}).code(500);
                }

                user.terrariums.push(terraNew);

                user.save();

                return reply({
                    "success": true,
                    message: "New terrarium created! Without thingies",
                    id: terri._id
                }).code(200);
            });
        });
    },

    terrariumUpdate: (request, reply) => {
        User.findOne({name: request.auth.credentials.userName})
            .exec((err, user) => {
                if (err) {
                    console.error(err);
                    return reply({"error": "Server error"}).code(500);
                }

                if(!user){
                    return reply({"error": "User not found"}).code(404);
                }

                let terra = user.terrariums.id(request.params.terrariumId);

                if(!terra){
                    return reply({"error": "No terrarium with this id", "id": request.params.terrariumId}).code(404);
                }

                terra.name = request.payload.name;
                terra.description = request.payload.description;


                user.save();

                return reply({
                    "success": true,
                    message: "New terrarium updated"
                }).code(200);
            });
    },

    terrariumDelete: (request, reply) => {
        User.findOne({name: request.auth.credentials.userName})
            .exec((err, user) => {
                if (err) {
                    console.error(err);
                    return reply({"message": "User not found"}).code(404);
                }

                let terra = user.terrariums.id(request.params.terrariumId);
                if (!terra) {
                    return reply({
                        "Error": "User has no terrarium with the given ID",
                        id: request.params.terrariumId
                    }).code(404);
                }

                if (terra.isDefault) {
                    return reply({
                        "Error": "You cant delete the default terrarium",
                        id: request.params.terrariumId
                    }).code(400);
                }

                let thingies = terra.thingies;
                if (thingies) {
                    var defaultTerra;
                    user.terrariums.forEach((terra) => {
                        if (terra.isDefault) {
                            defaultTerra = terra;
                            defaultTerra.thingies = defaultTerra.thingies.concat(thingies);
                            defaultTerra.save();
                        }
                    });

                    if (!defaultTerra) {
                        defaultTerra = new Terrarium({name: "Default Terrarium", isDefault: true});
                        defaultTerra.thingies.concat(thingies);
                        defaultTerra.save();
                        user.terrariums.push(defaultTerra);
                    }
                }

                user.terrariums.splice(user.terrariums.indexOf(terra), 1);

                user.save((err) => {
                    if (err) {
                        return reply({"message": "Something went wrong! Terrarium not saved"}).code(500);
                    }

                    return reply({
                        "success": true,
                        message: "Terrarium was deleted",
                        id: request.params.terrariumId
                    }).code(200);
                });
            });
    },

    terrariumThingies: function (request, reply) {
        User.findOne({name: request.auth.credentials.userName})
            .select("terrariums._id " +
                "terrariums.name " +
                "terrariums.description " +
                "terrariums.thingies._id " +
                "terrariums.thingies.macAddress " +
                "terrariums.thingies.description")
            .exec(function (err, user) {
                if (err) {
                    console.error(err);
                    return reply({"Error": "User not found"}).code(404);
                }
                let terra = user.terrariums.id(request.params.terrariumId);
                if (!terra) {
                    return reply({
                        "Error": "User has no terrarium with the given ID",
                        id: request.params.terrariumId
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
                let terra = user.terrariums.id(request.params.terrariumId);

                if (!terra) {
                    return reply({"Error": "User has no terrarium with the given ID",
                        id: request.params.terrariumId}).code(404);
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

                        thingy.humidities = hums;
                        thingy.temperatures = temps;
                        thingy.airQualities = airQs;

                        if (limit) {
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

                if (err) {
                    console.error(err);
                    return reply({"Error": "User not found"}).code(404);
                }

                if (from && to) {
                    terra.thingies.forEach(function (thingy) {
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
            .select("-terrariums.thingies.humidities -terrariums.thingies.airQualities -terrariums.thingies.temperatures -terrariums.thingies.thresholdViolations")
            .exec(function (err, user) {
                if (err) {
                    console.error(err);
                    return reply({"Error": "User not found"}).code(404);
                }

                let terra = user.terrariums.id(request.params.terrariumId);
                if (!terra) {
                    return reply({
                        "Error": "User has no terrarium with the given ID",
                        id: request.params.terrariumId
                    }).code(404);
                }

                reply(terra).code(200);
        });
    },

    terrariumViolations: function (request, reply) {
        User.findOne({name: request.auth.credentials.userName})
            .select("-terrariums.thingies.humidities -terrariums.thingies.airQualities -terrariums.thingies.temperatures -terrariums.thingies.targetConfiguration")
            .exec(function (err, user) {
                if (err) {
                    console.error(err);
                    return reply({"Error": "User not found"}).code(404);
                }
                let terra = user.terrariums.id(request.params.terrariumId);
                if (!terra) {
                    return reply({
                        "Error": "User has no terrarium with the given ID",
                        id: request.params.terrariumId
                    }).code(404);
                }

                reply(user.terrariums.id(request.params.terrariumId)).code(200);
        });
    },

    terrariumHumidities: function (request, reply) {
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

                if (err) {
                    console.error(err);
                    return reply({"Error": "User not found"}).code(404);
                }

                if (from && to) {
                    terra.thingies.forEach(function (thingy) {
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
            .select("-terrariums.thingies.temperatures -terrariums.thingies.humidities -terrariums.thingies.targetConfiguration -terrariums.thingies.thresholdViolations")
            .exec(function (err, user) {
                var from = request.query.from;
                var to = request.query.to;
                var limit = request.query.limit;
                let terra = user.terrariums.id(request.params.terrariumId);
                if (!terra) {
                    return reply({"Error": "User has no terrarium with the given ID",
                        id: request.params.terrariumId}).code(404);
                }

                if (err) {
                    console.error(err);
                    return reply({"Error": "User not found"}).code(404);
                }

                if (from && to) {
                    terra.thingies.forEach(function (thingy) {
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
