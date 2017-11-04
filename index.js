const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Joi = require('joi');
const Mongoose = require('mongoose');

//load model
require('./model/makeModel');

var Terri = Mongoose.model('Terrarium');
var Thingy = Mongoose.model('Thingy');
var Temp = Mongoose.model('Temperature');
var Hum = Mongoose.model('Humidity');
var AirQ = Mongoose.model('AirQuality');
var Tvoc = Mongoose.model('TVOC');
var Carbon = Mongoose.model('Carbondioxide');
var User = Mongoose.model('User');
var Unit = Mongoose.model('Unit');

// Create the DB connection
require("./model/helper/databaseConnection");

// URL Param Schemes
var thingyIdSchema = Joi.string().required().description('The Thingy UUID');
var sensorIdSchema = Joi.string().required().description('The Thingy Sensor');

const server = new Hapi.Server();
server.connection({
    host: '0.0.0.0',
    port: 8080,
    routes: {cors: true}
});

const swaggerOptions = {
    info: {
        'title': 'thingy-api-blue',
        'version': '1.0.0',
        'description': 'thingy-api-blue'
    }
}

server.register([
    Inert,
    Vision, {
        register: HapiSwagger,
        options: swaggerOptions
    }
]);

server.views({
    engines: {
        html: require('ejs')
    },
    relativeTo: __dirname,
    path: __dirname + '/templates'
});


/***********************************************************************************************************************
 *** START PUBLIC API
 **********************************************************************************************************************/

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply.view('index');
    },
    config: {
        tags: ['webclient'],
        description: 'gets the index',
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
    path: '/static/{param*}',
    handler: {
        directory: {
            path: 'web-client',
            listing: true
        }
    }
});

/**
 * ALL TERRARIUMS
 */
server.route({
    method: 'GET',
    path: '/terrariums',
    handler: function (request, reply) {
        //hardcode to test it
        User.findOne({name: "Joe Slowinski"})
            .select('terrariums._id terrariums.name terrariums.description')
            .exec(function (err, user) {
                if (err) {
                    console.log(err);
                } else {
                    reply(user).code(200);
                }
            });
    },
    config: {
        tags: ['webclient', 'api'],
        description: 'gets all the terrariums of a user',
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
        //hardcode to test it
        //if no querystring
        User.findOne({name: "Joe Slowinski"})
            .exec(function (err, user) {
                if (err) {
                    console.log(err);
                } else {
                    user.terrariums.forEach( function (t) {
                        t.thingies.forEach(function (thingy) {
                            thingy.humidities = thingy.humidities[thingy.humidities.length-1];
                            thingy.temperatures = thingy.temperatures[thingy.temperatures.length-1];
                            thingy.airQualities = thingy.airQualities[thingy.airQualities.length-1];
                        })
                    });

                    reply(user.terrariums).code(200);
                }
            });
    },
    config: {
        tags: ['webclient', 'api'],
        description: 'gets all the values from all the thingies in all the terrariums of a user',
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
        //hardcode to test it
        User.findOne({name: "Joe Slowinski"})
            .select('-terrariums.thingies.humidities -terrariums.thingies.airQualities')
            .exec(function (err, user) {
                if (err) {
                    console.log(err);
                } else {
                    user.terrariums.forEach( function (t) {
                        t.thingies.forEach(function (thingy) {
                            thingy.temperatures = thingy.temperatures[thingy.temperatures.length-1]
                        })
                    });

                    reply(user.terrariums).code(200);
                }
            });
    },
    config: {
        tags: ['webclient', 'api'],
        description: 'gets all the temperature values from all the thingies in all the terrariums of a user',
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
        //hardcode to test it
        User.findOne({name: "Joe Slowinski"})
            .select('-terrariums.thingies.temperatures -terrariums.thingies.airQualities')
            .exec(function (err, user) {
                if (err) {
                    console.log(err);
                } else {
                    user.terrariums.forEach( function (t) {
                        t.thingies.forEach(function (thingy) {
                            thingy.humidities = thingy.humidities[thingy.humidities.length-1]
                        })
                    });

                    reply(user.terrariums).code(200);
                }
            });
    },
    config: {
        tags: ['webclient', 'api'],
        description: 'gets all the humidity values from all the thingies in all the terrariums of a user',
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
        //hardcode to test it
        User.findOne({name: "Joe Slowinski"})
            .select('-terrariums.thingies.humidities -terrariums.thingies.temperatures')
            .exec(function (err, user) {
                if (err) {
                    console.log(err);
                } else {
                    user.terrariums.forEach( function (t) {
                        t.thingies.forEach(function (thingy) {
                            thingy.airQualities = thingy.airQualities[thingy.airQualities.length-1]
                        })
                    });

                    reply(user.terrariums).code(200);
                }
            });
    },
    config: {
        tags: ['webclient', 'api'],
        description: 'gets all the airquality values from all the thingies in all the terrariums of a user',
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
        User.findOne({name: "Joe Slowinski"})
            .select('terrariums._id ' +
                'terrariums.name ' +
                'terrariums.description ' +
                'terrariums.thingies._id ' +
                'terrariums.thingies.macAddress ' +
                'terrariums.thingies.description')
            .exec(function(err, user){
            if(err){
                reply({'error': 'User not found'});
            } else {
                reply(user.terrariums.id(request.params.terrarium_id)).code(200);
            }
        });
    },
    config: {
        tags: ['webclient', 'api'],
        description: 'gets all the thingies of a certain terrarium',
        validate:{
          params:{
              terrarium_id: Joi.string()
                                .required()
                                .description('Id of the Terrarium i want the Thingies of')
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
        User.findOne({name: "Joe Slowinski"})
            .exec(function(err, user){
                if(err){
                    reply({'error': 'User not found'});
                } else {
                    user.terrariums.forEach( function (t) {
                        t.thingies.forEach(function (thingy) {
                            thingy.humidities = thingy.humidities[thingy.humidities.length-1];
                            thingy.temperatures = thingy.temperatures[thingy.temperatures.length-1];
                            thingy.airQualities = thingy.airQualities[thingy.airQualities.length-1];
                        })
                    });
                    reply(user.terrariums.id(request.params.terrarium_id)).code(200);
                }
            });
    },
    config: {
        tags: ['webclient', 'api'],
        description: 'gets all the values  from all the thingies form a certain terrarium',
        validate:{
            params:{
                terrarium_id: Joi.string()
                    .required()
                    .description('Id of the Terrarium i want the values of')
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
        User.findOne({name: "Joe Slowinski"})
            .select('-terrariums.thingies.humidities -terrariums.thingies.airQualities')
            .exec(function (err, user) {
                if (err) {
                    console.log(err);
                } else {
                    user.terrariums.forEach( function (t) {
                        t.thingies.forEach(function (thingy) {
                            thingy.temperatures = thingy.temperatures[thingy.temperatures.length-1]
                        })
                    });

                    reply(user.terrariums.id(request.params.terrarium_id)).code(200);
                }
            });
    },
    config: {
        tags: ['webclient', 'api'],
        description: 'gets all the temperatures values from all the thingies form a certain terrarium',
        validate:{
            params:{
                terrarium_id: Joi.string()
                    .required()
                    .description('Id of the Terrarium i want the temperatures of')
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
        User.findOne({name: "Joe Slowinski"})
            .select('-terrariums.thingies.temperatures -terrariums.thingies.airQualities')
            .exec(function (err, user) {
                if (err) {
                    console.log(err);
                } else {
                    user.terrariums.forEach( function (t) {
                        t.thingies.forEach(function (thingy) {
                            thingy.humidities = thingy.humidities[thingy.humidities.length-1]
                        })
                    });

                    reply(user.terrariums.id(request.params.terrarium_id)).code(200);
                }
            });
    },
    config: {
        tags: ['webclient', 'api'],
        description: 'gets all the humidity values from all the thingies form a certain terrarium',
        validate:{
            params:{
                terrarium_id: Joi.string()
                    .required()
                    .description('Id of the Terrarium i want the humidities of')
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
        User.findOne({name: "Joe Slowinski"})
            .select('-terrariums.thingies.temperatures -terrariums.thingies.humidities')
            .exec(function (err, user) {
                if (err) {
                    console.log(err);
                } else {
                    user.terrariums.forEach( function (t) {
                        t.thingies.forEach(function (thingy) {
                            thingy.airQualities = thingy.airQualities[thingy.airQualities.length-1]
                        })
                    });

                    reply(user.terrariums.id(request.params.terrarium_id)).code(200);
                }
            });
    },
    config: {
        tags: ['webclient', 'api'],
        description: 'gets all the airquality values from all the thingies form a certain terrarium',
        validate:{
            params:{
                terrarium_id: Joi.string()
                    .required()
                    .description('Id of the Terrarium i want the airqualities of')
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
        User.findOne({name: "Joe Slowinski"})
            .exec(function(err, user){
                if(err){
                    reply({'error': 'User not found'});
                } else {
                    user.terrariums.forEach( function (t) {
                        t.thingies.forEach(function (thingy) {
                            thingy.humidities = thingy.humidities[thingy.humidities.length-1];
                            thingy.temperatures = thingy.temperatures[thingy.temperatures.length-1];
                            thingy.airQualities = thingy.airQualities[thingy.airQualities.length-1];
                        })
                    });
                    reply(user.terrariums.id(request.params.terrarium_id)
                        .thingies.id(request.params.thingy_id)).code(200);
                }
            });
    },
    config: {
        tags: ['webclient', 'api'],
        description: 'gets all the values that get measured in a certain terrarium with a certain thingy',
        validate:{
            params:{
                terrarium_id: Joi.string()
                    .required()
                    .description('Id of the Terrarium i want the values of'),
                thingy_id: Joi.string()
                    .required()
                    .description('Id of the Thingy i want the values of')
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
    path: '/terrarium/{terrarium_id}/thingies/{thingy_id}/temperature',
    handler: function (request, reply) {
        User.findOne({name: "Joe Slowinski"})
            .select('-terrariums.thingies.humidities -terrariums.thingies.airQualities')
            .exec(function(err, user){
                if(err){
                    reply({'error': 'User not found'});
                } else {
                    user.terrariums.forEach( function (t) {
                        t.thingies.forEach(function (thingy) {
                            thingy.temperatures = thingy.temperatures[thingy.temperatures.length-1];
                        })
                    });
                    reply(user.terrariums.id(request.params.terrarium_id)
                        .thingies.id(request.params.thingy_id)).code(200);
                }
            });
    },
    config: {
        tags: ['webclient', 'api'],
        description: 'gets the temperature that get measured in a certain terrarium with a certain thingy',
        validate:{
            params:{
                terrarium_id: Joi.string()
                    .required()
                    .description('Id of the Terrarium i want the temperature of'),
                thingy_id: Joi.string()
                    .required()
                    .description('Id of the Thingy i want the temperature of')
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
        User.findOne({name: "Joe Slowinski"})
            .select('-terrariums.thingies.temperatures -terrariums.thingies.airQualities')
            .exec(function(err, user){
                if(err){
                    reply({'error': 'User not found'});
                } else {
                    user.terrariums.forEach( function (t) {
                        t.thingies.forEach(function (thingy) {
                            thingy.humidities = thingy.humidities[thingy.humidities.length-1];
                        })
                    });
                    reply(user.terrariums.id(request.params.terrarium_id)
                        .thingies.id(request.params.thingy_id)).code(200);
                }
            });
    },
    config: {
        tags: ['webclient', 'api'],
        description: 'gets the humidity that get measured in a certain terrarium with a certain thingy',
        validate:{
            params:{
                terrarium_id: Joi.string()
                    .required()
                    .description('Id of the Terrarium i want the humidity of'),
                thingy_id: Joi.string()
                    .required()
                    .description('Id of the Thingy i want the humidity of')
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
        User.findOne({name: "Joe Slowinski"})
            .select('-terrariums.thingies.humidities -terrariums.thingies.temperatures')
            .exec(function(err, user){
                if(err){
                    reply({'error': 'User not found'});
                } else {
                    user.terrariums.forEach( function (t) {
                        t.thingies.forEach(function (thingy) {
                            thingy.airQualities = thingy.airQualities[thingy.airQualities.length-1];
                        })
                    });
                    reply(user.terrariums.id(request.params.terrarium_id)
                        .thingies.id(request.params.thingy_id)).code(200);
                }
            });
    },
    config: {
        tags: ['webclient', 'api'],
        description: 'gets the airquality that get measured in a certain terrarium with a certain thingy',
        validate:{
            params:{
                terrarium_id: Joi.string()
                    .required()
                    .description('Id of the Terrarium i want the airquality of'),
                thingy_id: Joi.string()
                    .required()
                    .description('Id of the Thingy i want the airquality of')
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


/***********************************************************************************************************************
 *** START THINGY API
 **********************************************************************************************************************/
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

        console.log('/thingy/{thingy_id}/register');

        reply({success:true}).code(200);
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
                        }
                        unit_percent = unit;
                    });

                    thingy.humidities.push(new Hum({
                        value: data.humidity,
                        unit: unit_percent,
                        timestamp: data.timestamp
                    }));
                    thingy.save();
                    break;
                case 'temperature':
                    var unit_cels;
                    Unit.find({name: "Celsius"}, function (err, unit) {
                        if (err) {
                            reply({"error": "Unit not in database"}).code(404);
                        }
                        unit_cels = unit;
                    });

                    thingy.temperatures.push(new Temp({
                        value: data.humidity,
                        unit: unit_cels,
                        timestamp: data.timestamp
                    }));
                    thingy.save();
                    break;
                case 'gas':
                    var unit1_db;
                    Unit.find({name: "gram per qubic meter"}, function (err, unit1) {
                        if (err) {
                            reply({"error": "Unit not in database"}).code(404);
                        }
                        unit1_db = unit1;
                    });

                    var unit2_db;
                    Unit.find({name: "microgram per qubic meter"}, function (err, unit2) {
                        if (err) {
                            reply({"error": "Unit not in database"}).code(404);
                        }
                        unit2_db = unit2;
                    });

                    var carb = new Carbon({value: data.gas.eco2, unit: unit1_db});
                    var tvoc = new Tvoc({value: data.gas.tvoc, unit: unit2_db});

                    thingy.airQualities.push(new AirQ({co2: carb, tvoc: tvoc}));
                    thingy.save();
                    break;
            }

        });

        // TODO: Store data by Thingy and sensor
        console.log('Tingy: ' + thingyId);
        console.log('Sensor: ' + sensorId);
        console.log('Data: ' + JSON.stringify(request.payload));

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

server.start(function (err) {
    console.log('Server running at: ', server.info.uri);
});
