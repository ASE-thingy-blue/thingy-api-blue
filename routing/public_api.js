const Joi = require('joi');
const Mongoose = require('mongoose');
const Jwt = require('jwt-simple');

var Thingy = Mongoose.model('Thingy');
var User = Mongoose.model('User');
var Unit = Mongoose.model('Unit');

// Quirk to have synchronously loaded modules with require() that use return values loaded asynchronously
// It is not possible to write:
// const Session = require('./session');
// Session is always undefined here because this line will get evaluated before that value is available
var Session;
require('./session').then(hashKey =>
{
    Session = { 'tokenKey' : hashKey };
});

const getAuthenticatedPayload = function (request, callback)
{
    const key = Session.tokenKey;

    if (!key || !request.headers || !request.headers.authorization)
    {
        return callback(new Error("No token or key supplied"), null);
    }
    try
    {
        callback(null, Jwt.decode(request.headers.authorization, key));
    }
    catch (ex)
    {
        callback(ex, null);
    }
}

var createPublicAPI = (server) => {
    /**
     * ALL TERRARIUMS
     */
    server.route({
        method: 'GET',
        path: '/terrariums',
        handler: function (request, reply) {
            getAuthenticatedPayload(request, function(error, payload)
            {
                if (error)
                {
                    console.error(error.toString());
                    return reply(error.toString()).code(401);
                }
                if (!payload) { return; }

                User.findOne({name: payload.userName})
                    .select('terrariums._id terrariums.name terrariums.description')
                    .exec(function (err, user) {
                        if (err) {
                            console.error(err);
                            return reply({"Error": "User not found"}).code(404);
                        } else {
                            reply(user).code(200);
                        }
                });
            });
        },
        config: {
            tags: ['webclient', 'api'],
            description: 'Gets all terrariums of a user',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/terrariums/values',
        handler: function (request, reply) {
            getAuthenticatedPayload(request, function(error, payload)
            {
                if (error)
                {
                    console.error(error.toString());
                    return reply(error.toString()).code(401);
                }
                if (!payload) { return; }

                User.findOne({name: payload.userName})
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
                                            hums.push(hum)
                                        }
                                    });

                                    thingy.temperatures.forEach(function (temp) {
                                        if(temp.timestamp >= from && temp.timestamp <= to){
                                            temps.push(temp)
                                        }
                                    });

                                    thingy.airQualities.forEach(function (airQ) {
                                        if(airQ.timestamp >= from && airQ.timestamp <= to){
                                            airQs.push(airQ)
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
                                })
                            });
                        }

                        reply(user.terrariums).code(200);
                });
            });
        },
        config: {
            tags: ['webclient', 'api'],
            description: 'Gets all values from all Thingies in all terrariums of a user',
            validate: {
                query: {
                    limit: Joi.number().description('Amount of results'),
                    from: Joi.date().description('Value from a certain date'),
                    to: Joi.date().description('Value to a certain date')
                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/terrariums/configurations',
        handler: function (request, reply) {
            getAuthenticatedPayload(request, function(error, payload)
            {
                if (error)
                {
                    console.error(error.toString());
                    return reply(error.toString()).code(401);
                }
                if (!payload) { return; }

                User.findOne({name: payload.userName}).select('-terrariums.thingies.humidities -terrariums.thingies.temperatures -terrariums.thingies.airQualities -terrariums.thingies.thresholdViolations')
                    .exec(function (err, user) {
                        if (err) {
                            console.error(err);
                            return reply({'Error': 'User not found'}).code(404);
                        } else {
                            reply(user.terrariums).code(200);
                        }
                });
            });
        },
        config: {
            tags: ['webclient', 'api'],
            description: 'Gets the configuration from all Thingies in all the terrariums of a user',
            validate: {

            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/terrariums/violations',
        handler: function (request, reply) {
            getAuthenticatedPayload(request, function(error, payload)
            {
                if (error)
                {
                    console.error(error.toString());
                    return reply(error.toString()).code(401);
                }
                if (!payload) { return; }

                User.findOne({name: payload.userName}).select('-terrariums.thingies.humidities -terrariums.thingies.temperatures -terrariums.thingies.airQualities -terrariums.thingies.targetConfiguration')
                    .exec(function (err, user) {
                        if (err) {
                            console.error(err);
                            return reply({'Error': 'User not found'}).code(404);
                        } else {
                            reply(user.terrariums).code(200);
                        }
                });
            });
        },
        config: {
            tags: ['webclient', 'api'],
            description: 'Gets all threshold violations from all Thingies in all terrariums of a user',
            validate: {

            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/terrariums/temperature',
        handler: function (request, reply) {
            getAuthenticatedPayload(request, function(error, payload)
            {
                if (error)
                {
                    console.error(error.toString());
                    return reply(error.toString()).code(401);
                }
                if (!payload) { return; }

                User.findOne({name: payload.userName})
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
                                            temps.push(temp)
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
                                })
                            });
                        }

                        reply(user.terrariums).code(200);
                });
            });
        },
        config: {
            tags: ['webclient', 'api'],
            description: 'Gets all temperature values from all Thingies in all terrariums of a user',
            validate: {
                query: {
                    limit: Joi.number().description('Amount of results'),
                    from: Joi.date().description('Value from a certain date'),
                    to: Joi.date().description('Value to a certain date')
                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/terrariums/humidity',
        handler: function (request, reply) {
            getAuthenticatedPayload(request, function(error, payload)
            {
                if (error)
                {
                    console.error(error.toString());
                    return reply(error.toString()).code(401);
                }
                if (!payload) { return; }

                User.findOne({name: payload.userName})
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
                                            hums.push(hum)
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
                                })
                            });
                        }

                        reply(user.terrariums).code(200);
                });
            });
        },
        config: {
            tags: ['webclient', 'api'],
            description: 'Gets all humidity values from all Thingies in all terrariums of a user',
            validate: {
                query: {
                    limit: Joi.number().description('Amount of results'),
                    from: Joi.date().description('Value from a certain date'),
                    to: Joi.date().description('Value to a certain date')
                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/terrariums/airquality',
        handler: function (request, reply) {
            getAuthenticatedPayload(request, function(error, payload)
            {
                if (error)
                {
                    console.error(error.toString());
                    return reply(error.toString()).code(401);
                }
                if (!payload) { return; }

                User.findOne({name: payload.userName})
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
                                            airQs.push(airQ)
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
                                    thingy.humidities = thingy.humidities[thingy.humidities.length - 1];
                                })
                            });
                        }

                        reply(user.terrariums).code(200);
                });
            });
        },
        config: {
            tags: ['webclient', 'api'],
            description: 'Gets all airquality values from all Thingies in all terrariums of a user',
            validate: {
                query: {
                    limit: Joi.number().description('Amount of results'),
                    from: Joi.date().description('Value from a certain date'),
                    to: Joi.date().description('Value to a certain date')
                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success'
                        }
                    }
                }
            }
        }
    });

    /**
     * SPECIFIC TERRARIUM
     */
    server.route({
        method: 'GET',
        path: '/terrarium/{terrarium_id}/thingies',
        handler: function (request, reply) {
            getAuthenticatedPayload(request, function(error, payload)
            {
                if (error)
                {
                    console.error(error.toString());
                    return reply(error.toString()).code(401);
                }
                if (!payload) { return; }

                User.findOne({name: payload.userName})
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
                                "error": "User has no terrarium with the given id",
                                id: request.params.terrarium_id
                            }).code(401);
                        }

                        reply(terra).code(200);
                });
            });
        },
        config: {
            tags: ['webclient', 'api'],
            description: 'Gets all Thingies of a certain terrarium',
            validate: {
                params: {
                    terrarium_id: Joi.string()
                        .required()
                        .description('ID of the terrarium I want the Thingies from')
                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/terrarium/{terrarium_id}/values',
        handler: function (request, reply) {
            getAuthenticatedPayload(request, function(error, payload)
            {
                if (error)
                {
                    console.error(error.toString());
                    return reply(error.toString()).code(401);
                }
                if (!payload) { return; }

                User.findOne({name: payload.userName}).select("-terrariums.thingies.targetConfiguration -terrariums.thingies.thresholdViolations")
                    .exec(function (err, user) {
                        var from = request.query.from;
                        var to = request.query.to;
                        var limit = request.query.limit;
                        let terra = user.terrariums.id(request.params.terrarium_id);

                        if(!terra){
                            return reply({"error": "User has no terrarium with the given id",
                                id: request.params.terrarium_id}).code(401);
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
                                        airQs.push(airQ)
                                    }
                                });

                                thingy.temperatures.forEach(function (temp) {
                                    if(temp.timestamp >= from && temp.timestamp <= to){
                                        temps.push(temp)
                                    }
                                });

                                thingy.humidities.forEach(function (hum) {
                                    if(hum.timestamp >= from && hum.timestamp <= to){
                                        hums.push(hum)
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
                            })
                        }

                        reply(terra).code(200);
                });
            });
        },
        config: {
            tags: ['webclient', 'api'],
            description: 'Gets all values from all Thingies form a certain terrarium',
            validate: {
                params: {
                    terrarium_id: Joi.string()
                        .required()
                        .description('ID of the terrarium I want the values from')
                },
                query: {
                    limit: Joi.number().description('Amount of results'),
                    from: Joi.date().description('Value from a certain date'),
                    to: Joi.date().description('Value to a certain date')
                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/terrarium/{terrarium_id}/temperatures',
        handler: function (request, reply) {
            getAuthenticatedPayload(request, function(error, payload)
            {
                if (error)
                {
                    console.error(error.toString());
                    return reply(error.toString()).code(401);
                }
                if (!payload) { return; }

                User.findOne({name: payload.userName})
                    .select('-terrariums.thingies.humidities -terrariums.thingies.airQualities -terrariums.thingies.targetConfiguration -terrariums.thingies.thresholdViolations')
                    .exec(function (err, user) {
                        var from = request.query.from;
                        var to = request.query.to;
                        var limit = request.query.limit;
                        var terra = user.terrariums.id(request.params.terrarium_id);

                        if(!terra){
                            return reply({"error": "User has no terrarium with the given id",
                                id: request.params.terrarium_id}).code(401);
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
                                        temps.push(temp)
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
                            })
                        }

                        reply(terra).code(200);
                });
            });
        },
        config: {
            tags: ['webclient', 'api'],
            description: 'Gets all temperatures values from all Thingies form a certain terrarium',
            validate: {
                params: {
                    terrarium_id: Joi.string()
                        .required()
                        .description('ID of the terrarium I want the temperature from')
                },
                query: {
                    limit: Joi.number().description('Amount of results'),
                    from: Joi.date().description('Value from a certain date'),
                    to: Joi.date().description('Value to a certain date')
                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/terrarium/{terrarium_id}/configurations',
        handler: function (request, reply) {
            getAuthenticatedPayload(request, function(error, payload)
            {
                if (error)
                {
                    console.error(error.toString());
                    return reply(error.toString()).code(401);
                }
                if (!payload) { return; }

                User.findOne({name: payload.userName})
                    .select('-terrariums.thingies.humidities -terrariums.thingies.airQualities -terrariums.thingies.temperatures -terrariums.thingies.thresholdViolations')
                    .exec(function (err, user) {
                        if (err) {
                            console.error(err);
                            return reply({'Error': 'User not found'}).code(404);
                        }

                        let terra = user.terrariums.id(request.params.terrarium_id);
                        if (!terra) {
                            return reply({
                                "error": "User has no terrarium with the given id",
                                id: request.params.terrarium_id
                            }).code(401);
                        }

                        reply(terra).code(200);
                });
            });
        },
        config: {
            tags: ['webclient', 'api'],
            description: 'Gets the configurations from all Thingies form a certain terrarium',
            validate: {
                params: {
                    terrarium_id: Joi.string()
                        .required()
                        .description('ID of the terrarium I want the configurations from')
                },
                query: {

                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/terrarium/{terrarium_id}/violations',
        handler: function (request, reply) {
            getAuthenticatedPayload(request, function(error, payload)
            {
                if (error)
                {
                    console.error(error.toString());
                    return reply(error.toString()).code(401);
                }
                if (!payload) { return; }

                User.findOne({name: payload.userName})
                    .select('-terrariums.thingies.humidities -terrariums.thingies.airQualities -terrariums.thingies.temperatures -terrariums.thingies.targetConfiguration')
                    .exec(function (err, user) {
                        if (err) {
                            console.error(err);
                            return reply({'Error': 'User not found'}).code(404);
                        }
                        let terra = user.terrariums.id(request.params.terrarium_id);
                        if (!terra) {
                            return reply({
                                "error": "User has no terrarium with the given id",
                                id: request.params.terrarium_id
                            }).code(401);
                        }

                        reply(user.terrariums.id(request.params.terrarium_id)).code(200);
                });
            });
        },
        config: {
            tags: ['webclient', 'api'],
            description: 'Gets the threshold violations from all Thingies form a certain terrarium',
            validate: {
                params: {
                    terrarium_id: Joi.string()
                        .required()
                        .description('ID of the terrarium I want the threshold violations from')
                },
                query: {

                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/terrarium/{terrarium_id}/humidities',
        handler: function (request, reply) {
            getAuthenticatedPayload(request, function(error, payload)
            {
                if (error)
                {
                    console.error(error.toString());
                    return reply(error.toString()).code(401);
                }
                if (!payload) { return; }

                User.findOne({name: payload.userName})
                    .select('-terrariums.thingies.temperatures -terrariums.thingies.airQualities -terrariums.thingies.targetConfiguration -terrariums.thingies.thresholdViolations')
                    .exec(function (err, user) {
                        var from = request.query.from;
                        var to = request.query.to;
                        var limit = request.query.limit;
                        let terra = user.terrariums.id(request.params.terrarium_id);
                        if(!terra){
                            return reply({"error": "User has no terrarium with the given id",
                                id: request.params.terrarium_id}).code(401);
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
                                        hums.push(hum)
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
                            })
                        }

                        reply(terra).code(200);
                });
            });
        },
        config: {
            tags: ['webclient', 'api'],
            description: 'Gets all humidity values from all Thingies form a certain terrarium',
            validate: {
                params: {
                    terrarium_id: Joi.string()
                        .required()
                        .description('ID of the terrarium I want the humidity from')
                },
                query: {
                    limit: Joi.number().description('Amount of results'),
                    from: Joi.date().description('Value from a certain date'),
                    to: Joi.date().description('Value to a certain date')
                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/terrarium/{terrarium_id}/airqualities',
        handler: function (request, reply) {
            getAuthenticatedPayload(request, function(error, payload)
            {
                if (error)
                {
                    console.error(error.toString());
                    return reply(error.toString()).code(401);
                }
                if (!payload) { return; }

                User.findOne({name: payload.userName})
                    .select('-terrariums.thingies.temperatures -terrariums.thingies.humidities -terrariums.thingies.targetConfiguration -terrariums.thingies.thresholdViolations')
                    .exec(function (err, user) {
                        var from = request.query.from;
                        var to = request.query.to;
                        var limit = request.query.limit;
                        let terra = user.terrariums.id(request.params.terrarium_id);
                        if(!terra){
                            return reply({"error": "User has no terrarium with the given id",
                                id: request.params.terrarium_id}).code(401);
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
                                        airQs.push(airQ)
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
                            })
                        }

                        reply(terra).code(200);
                });
            });
        },
        config: {
            tags: ['webclient', 'api'],
            description: 'Gets all airquality values from all Thingies form a certain terrarium',
            validate: {
                params: {
                    terrarium_id: Joi.string()
                        .required()
                        .description('ID of the terrarium I want the airquality from')
                },
                query: {
                    limit: Joi.number().description('Amount of results'),
                    from: Joi.date().description('Value from a certain date'),
                    to: Joi.date().description('Value to a certain date')
                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success'
                        }
                    }
                }
            }
        }
    });

    /**
     * SPECIFIC THINGY IN A TERRARIUM
     */
    server.route({
        method: 'GET',
        path: '/terrarium/{terrarium_id}/thingies/{thingy_id}/values',
        handler: function (request, reply) {
            getAuthenticatedPayload(request, function(error, payload)
            {
                if (error)
                {
                    console.error(error.toString());
                    return reply(error.toString()).code(401);
                }
                if (!payload) { return; }

                User.findOne({name: payload.userName}).select("-terrariums.thingies.targetConfiguration -terrariums.thingies.thresholdViolations")
                    .exec(function (err, user) {
                        var from = request.query.from;
                        var to = request.query.to;
                        var limit = request.query.limit;
                        let terra = user.terrariums.id(request.params.terrarium_id);
                        if(!terra){
                            return reply({"error": "User has no terrarium with the given id",
                                id: request.params.terrarium_id}).code(401);
                        }

                        let thingy = terra.thingies.id(request.params.thingy_id);
                        if(!thingy){
                            return reply({"error": "Terrarium has no thingy with the given id",
                                id: request.params.thingy_id}).code(401);
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
                                if(airQ.timestamp >= from && airQ.timestamp <= to){
                                    airQs.push(airQ)
                                }
                            });

                            thingy.temperatures.forEach(function (temp) {
                                if(temp.timestamp >= from && temp.timestamp <= to){
                                    temps.push(temp)
                                }
                            });

                            thingy.humidities.forEach(function (hum) {
                                if(hum.timestamp >= from && hum.timestamp <= to){
                                    hums.push(hum)
                                }
                            });

                            thingy.airQualities = airQs;
                            thingy.temperatures = temps;
                            thingy.humidities = hums;

                            if(limit){
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
            });
        },
        config: {
            tags: ['webclient', 'api'],
            description: 'Gets all values that are measured in a certain terrarium with a certain Thingy',
            validate: {
                params: {
                    terrarium_id: Joi.string()
                        .required()
                        .description('ID of the terrarium I want the values from'),
                    thingy_id: Joi.string()
                        .required()
                        .description('ID of the Thingy I want the values from')
                },
                query: {
                    limit: Joi.number().description('Amount of results'),
                    from: Joi.date().description('Value from a certain date'),
                    to: Joi.date().description('Value to a certain date')
                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/terrarium/{terrarium_id}/thingies/{thingy_id}/configuration',
        handler: function (request, reply) {
            getAuthenticatedPayload(request, function(error, payload)
            {
                if (error)
                {
                    console.error(error.toString());
                    return reply(error.toString()).code(401);
                }
                if (!payload) { return; }

                User.findOne({name: payload.userName})
                    .select('-terrariums.thingies.humidities -terrariums.thingies.airQualities -terrariums.thingies.temperatures -terrariums.thingies.thresholdViolations')
                    .exec(function (err, user) {
                        if (err) {
                            console.error(err);
                            return reply({'Error': 'User not found'}).code(404);
                        } else {
                            let terra = user.terrariums.id(request.params.terrarium_id);
                            if(!terra){
                                return reply({"error": "User has no terrarium with the given id",
                                    id: request.params.terrarium_id}).code(401);
                            }

                            let thingy = terra.thingies.id(request.params.thingy_id);
                            if(!thingy){
                                return reply({"error": "Terrarium has no thingy with the given id",
                                    id: request.params.thingy_id}).code(401);
                            }

                            reply(thingy).code(200);
                        }
                });
            });
        },
        config: {
            tags: ['webclient', 'api'],
            description: 'Gets the configuration of a certain Thingy',
            validate: {
                params: {
                    terrarium_id: Joi.string()
                        .required()
                        .description('ID of the terrarium I want the Thingy configuration from'),
                    thingy_id: Joi.string()
                        .required()
                        .description('ID of the Thingy I want the configuration from')
                },
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/terrarium/{terrarium_id}/thingies/{thingy_id}/violations',
        handler: function (request, reply) {
            getAuthenticatedPayload(request, function(error, payload)
            {
                if (error)
                {
                    console.error(error.toString());
                    return reply(error.toString()).code(401);
                }
                if (!payload) { return; }

                User.findOne({name: payload.userName})
                    .select('-terrariums.thingies.humidities -terrariums.thingies.airQualities -terrariums.thingies.temperatures -terrariums.thingies.targetConfiguration')
                    .exec(function (err, user) {
                        if (err) {
                            console.error(err);
                            return reply({'Error': 'User not found'}).code(404);
                        } else {
                            let terra = user.terrariums.id(request.params.terrarium_id);
                            if(!terra){
                                return reply({"error": "User has no terrarium with the given id",
                                    id: request.params.terrarium_id}).code(401);
                            }

                            let thingy = terra.thingies.id(request.params.thingy_id);
                            if(!thingy){
                                return reply({"error": "Terrarium has no thingy with the given id",
                                    id: request.params.thingy_id}).code(401);
                            }

                            reply(thingy).code(200);
                        }
                });
            });
        },
        config: {
            tags: ['webclient', 'api'],
            description: 'Gets the threshold violations of a certain Thingy',
            validate: {
                params: {
                    terrarium_id: Joi.string()
                        .required()
                        .description('ID of the terrarium I want the threshold violations from'),
                    thingy_id: Joi.string()
                        .required()
                        .description('ID of the Thingy I want the threshold violations from')
                },
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/terrarium/{terrarium_id}/thingies/{thingy_id}/temperature',
        handler: function (request, reply) {
            getAuthenticatedPayload(request, function(error, payload)
            {
                if (error)
                {
                    console.error(error.toString());
                    return reply(error.toString()).code(401);
                }
                if (!payload) { return; }

                User.findOne({name: payload.userName})
                    .select('-terrariums.thingies.humidities -terrariums.thingies.airQualities -terrariums.thingies.targetConfiguration -terrariums.thingies.thresholdViolations')
                    .exec(function (err, user) {
                        var from = request.query.from;
                        var to = request.query.to;
                        var limit = request.query.limit;
                        let terra = user.terrariums.id(request.params.terrarium_id);
                        if(!terra){
                            return reply({"error": "User has no terrarium with the given id",
                                id: request.params.terrarium_id}).code(401);
                        }

                        let thingy = terra.thingies.id(request.params.thingy_id);
                        if(!thingy){
                            return reply({"error": "Terrarium has no thingy with the given id",
                                id: request.params.thingy_id}).code(401);
                        }

                        if (err) {
                            console.error(err);
                            return reply({"Error": "User not found"}).code(404);
                        }

                        if (from && to) {
                            var temps = [];

                            thingy.temperatures.forEach(function (temp) {
                                if(temp.timestamp >= from && temp.timestamp <= to){
                                    temps.push(temp)
                                }
                            });

                            thingy.temperatures = temps;

                            if(limit){
                                thingy.temperatures.splice(limit, thingy.temperatures.length - limit);
                            }

                        } else {
                            thingy.temperatures = thingy.temperatures[thingy.temperatures.length - 1];
                        }

                        reply(thingy).code(200);
                });
            });
        },
        config: {
            tags: ['webclient', 'api'],
            description: 'Gets the temperature that is measured in a certain terrarium with a certain Thingy',
            validate: {
                params: {
                    terrarium_id: Joi.string()
                        .required()
                        .description('ID of the terrarium I want the temperature from'),
                    thingy_id: Joi.string()
                        .required()
                        .description('ID of the Thingy I want the temperature from')
                },
                query: {
                    limit: Joi.number().description('Amount of results'),
                    from: Joi.date().description('Value from a certain date'),
                    to: Joi.date().description('Value to a certain date')
                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/terrarium/{terrarium_id}/thingies/{thingy_id}/humidity',
        handler: function (request, reply) {
            getAuthenticatedPayload(request, function(error, payload)
            {
                if (error)
                {
                    console.error(error.toString());
                    return reply(error.toString()).code(401);
                }
                if (!payload) { return; }

                User.findOne({name: payload.userName})
                    .select('-terrariums.thingies.temperatures -terrariums.thingies.airQualities -terrariums.thingies.targetConfiguration -terrariums.thingies.thresholdViolations')
                    .exec(function (err, user) {
                        var from = request.query.from;
                        var to = request.query.to;
                        var limit = request.query.limit;
                        let terra = user.terrariums.id(request.params.terrarium_id);
                        if(!terra){
                            return reply({"error": "User has no terrarium with the given id",
                                id: request.params.terrarium_id}).code(401);
                        }

                        let thingy = terra.thingies.id(request.params.thingy_id);
                        if(!thingy){
                            return reply({"error": "Terrarium has no thingy with the given id",
                                id: request.params.thingy_id}).code(401);
                        }

                        if (err) {
                            console.error(err);
                            return reply({"Error": "User not found"}).code(404);
                        }

                        if (from && to) {
                            var hums = [];

                            thingy.humidities.forEach(function (hum) {
                                if(hum.timestamp >= from && hum.timestamp <= to){
                                    hums.push(hum)
                                }
                            });

                            thingy.humidities = hums;

                            if(limit){
                                thingy.humidities.splice(limit, thingy.humidities.length - limit);
                            }

                        } else {
                            thingy.humidities = thingy.humidities[thingy.humidities.length - 1];
                        }

                        reply(thingy).code(200);
                });
            });
        },
        config: {
            tags: ['webclient', 'api'],
            description: 'Gets the humidity that is measured in a certain terrarium with a certain Thingy',
            validate: {
                params: {
                    terrarium_id: Joi.string()
                        .required()
                        .description('ID of the terrarium I want the humidity from'),
                    thingy_id: Joi.string()
                        .required()
                        .description('ID of the Thingy I want the humidity from')
                },
                query: {
                    limit: Joi.number().description('Amount of results'),
                    from: Joi.date().description('Value from a certain date'),
                    to: Joi.date().description('Value to a certain date')
                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/terrarium/{terrarium_id}/thingies/{thingy_id}/airquality',
        handler: function (request, reply) {
            getAuthenticatedPayload(request, function(error, payload)
            {
                if (error)
                {
                    console.error(error.toString());
                    return reply(error.toString()).code(401);
                }
                if (!payload) { return; }

                User.findOne({name: payload.userName})
                    .select('-terrariums.thingies.humidities -terrariums.thingies.temperatures -terrariums.thingies.targetConfiguration -terrariums.thingies.thresholdViolations')
                    .exec(function (err, user) {
                        var from = request.query.from;
                        var to = request.query.to;
                        var limit = request.query.limit;
                        let terra = user.terrariums.id(request.params.terrarium_id);
                        if(!terra){
                            return reply({"error": "User has no terrarium with the given id",
                                id: request.params.terrarium_id}).code(401);
                        }

                        let thingy = terra.thingies.id(request.params.thingy_id);
                        if(!thingy){
                            return reply({"error": "Terrarium has no thingy with the given id",
                                id: request.params.thingy_id}).code(401);
                        }

                        if (err) {
                            console.error(err);
                            return reply({"Error": "User not found"}).code(404);
                        }

                        if (from && to) {
                            var airQs = [];

                            thingy.airQualities.forEach(function (airQ) {
                                if(airQ.timestamp >= from && airQ.timestamp <= to){
                                    airQs.push(airQ)
                                }
                            });

                            thingy.airQualities = airQs;

                            if(limit){
                                thingy.airQualities.splice(limit, thingy.airQualities.length - limit);
                            }

                        } else {
                            thingy.airQualities = thingy.airQualities[thingy.airQualities.length - 1];
                        }

                        reply(thingy).code(200);
                });
            });
        },
        config: {
            tags: ['webclient', 'api'],
            description: 'Gets the airquality that is measured in a certain terrarium with a certain Thingy',
            validate: {
                params: {
                    terrarium_id: Joi.string()
                        .required()
                        .description('ID of the terrarium I want the airquality from'),
                    thingy_id: Joi.string()
                        .required()
                        .description('ID of the Thingy I want the airquality from')
                },
                query: {
                    limit: Joi.number().description('Amount of results'),
                    from: Joi.date().description('Value from a certain date'),
                    to: Joi.date().description('Value to a certain date')
                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success'
                        }
                    }
                }
            }
        }
    });
}

module.exports = createPublicAPI;
