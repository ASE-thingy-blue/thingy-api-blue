const Joi = require('joi');
const Mongoose = require('mongoose');

var Thingy = Mongoose.model('Thingy');
var User = Mongoose.model('User');
var Unit = Mongoose.model('Unit');

var createPublicAPI = (server)=>{
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
                        if (!request.query.past) {
                            user.terrariums.forEach(function (t) {
                                t.thingies.forEach(function (thingy) {
                                    thingy.humidities = thingy.humidities[thingy.humidities.length - 1];
                                    thingy.temperatures = thingy.temperatures[thingy.temperatures.length - 1];
                                    thingy.airQualities = thingy.airQualities[thingy.airQualities.length - 1];
                                })
                            });
                        }

                        reply(user.terrariums).code(200);
                    }
                });
        },
        config: {
            tags: ['webclient', 'api'],
            description: 'gets all the values from all the thingies in all the terrariums of a user',
            validate: {
                query: {
                    past: Joi.boolean()
                    /*from: Joi.date()
                        .description('Value from a certain date'),
                    to: Joi.date().description('Value to a certain date')*/
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
        path: '/terrariums/temperature',
        handler: function (request, reply) {
            //hardcode to test it
            User.findOne({name: "Joe Slowinski"})
                .select('-terrariums.thingies.humidities -terrariums.thingies.airQualities -terrariums.thingies.targetConfiguration -terrariums.thingies.thresholdViolations')
                .exec(function (err, user) {
                    if (err) {
                        console.log(err);
                    } else {
                        if (!request.query.past) {
                            user.terrariums.forEach(function (t) {
                                t.thingies.forEach(function (thingy) {
                                    thingy.temperatures = thingy.temperatures[thingy.temperatures.length - 1]
                                })
                            });
                        }

                        reply(user.terrariums).code(200);
                    }
                });
        },
        config: {
            tags: ['webclient', 'api'],
            description: 'gets all the temperature values from all the thingies in all the terrariums of a user',
            validate: {
                query: {
                    past: Joi.boolean()
                    /*from: Joi.date()
                        .description('Value from a certain date'),
                    to: Joi.date().description('Value to a certain date')*/
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
            //hardcode to test it
            User.findOne({name: "Joe Slowinski"})
                .select('-terrariums.thingies.temperatures -terrariums.thingies.airQualities  -terrariums.thingies.targetConfiguration -terrariums.thingies.thresholdViolations')
                .exec(function (err, user) {
                    if (err) {
                        console.log(err);
                    } else {
                        if (!request.query.past) {

                            user.terrariums.forEach(function (t) {
                                t.thingies.forEach(function (thingy) {
                                    thingy.humidities = thingy.humidities[thingy.humidities.length - 1]
                                })
                            });
                        }

                        reply(user.terrariums).code(200);
                    }
                });
        },
        config: {
            tags: ['webclient', 'api'],
            description: 'gets all the humidity values from all the thingies in all the terrariums of a user',
            validate: {
                query: {
                    past: Joi.boolean()
                    /*from: Joi.date()
                        .description('Value from a certain date'),
                    to: Joi.date().description('Value to a certain date')*/
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
            //hardcode to test it
            User.findOne({name: "Joe Slowinski"})
                .select('-terrariums.thingies.humidities -terrariums.thingies.temperatures -terrariums.thingies.targetConfiguration -terrariums.thingies.thresholdViolations')
                .exec(function (err, user) {
                    if (err) {
                        console.log(err);
                    } else {
                        if (!request.query.past) {
                            user.terrariums.forEach(function (t) {
                                t.thingies.forEach(function (thingy) {
                                    thingy.airQualities = thingy.airQualities[thingy.airQualities.length - 1]
                                })
                            });
                        }

                        reply(user.terrariums).code(200);
                    }
                });
        },
        config: {
            tags: ['webclient', 'api'],
            description: 'gets all the airquality values from all the thingies in all the terrariums of a user',
            validate: {
                query: {
                    past: Joi.boolean()
                    /*from: Joi.date()
                        .description('Value from a certain date'),
                    to: Joi.date().description('Value to a certain date')*/
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
            User.findOne({name: "Joe Slowinski"})
                .select('terrariums._id ' +
                    'terrariums.name ' +
                    'terrariums.description ' +
                    'terrariums.thingies._id ' +
                    'terrariums.thingies.macAddress ' +
                    'terrariums.thingies.description')
                .exec(function (err, user) {
                    if (err) {
                        reply({'error': 'User not found'});
                    } else {
                        reply(user.terrariums.id(request.params.terrarium_id)).code(200);
                    }
                });
        },
        config: {
            tags: ['webclient', 'api'],
            description: 'gets all the thingies of a certain terrarium',
            validate: {
                params: {
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
                .exec(function (err, user) {
                    if (err) {
                        reply({'error': 'User not found'});
                    } else {
                        if (!request.query.past) {
                            user.terrariums.forEach(function (t) {
                                t.thingies.forEach(function (thingy) {
                                    thingy.humidities = thingy.humidities[thingy.humidities.length - 1];
                                    thingy.temperatures = thingy.temperatures[thingy.temperatures.length - 1];
                                    thingy.airQualities = thingy.airQualities[thingy.airQualities.length - 1];
                                })
                            });
                        }

                        reply(user.terrariums.id(request.params.terrarium_id)).code(200);
                    }
                });
        },
        config: {
            tags: ['webclient', 'api'],
            description: 'gets all the values  from all the thingies form a certain terrarium',
            validate: {
                params: {
                    terrarium_id: Joi.string()
                        .required()
                        .description('Id of the Terrarium i want the values of')
                },
                query: {
                    past: Joi.boolean()
                    /*from: Joi.date()
                        .description('Value from a certain date'),
                    to: Joi.date().description('Value to a certain date')*/
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
                .select('-terrariums.thingies.humidities -terrariums.thingies.airQualities -terrariums.thingies.targetConfiguration -terrariums.thingies.thresholdViolations')
                .exec(function (err, user) {
                    if (err) {
                        console.log(err);
                    } else {
                        if (!request.query.past) {
                            user.terrariums.forEach(function (t) {
                                t.thingies.forEach(function (thingy) {
                                    thingy.temperatures = thingy.temperatures[thingy.temperatures.length - 1]
                                })
                            });
                        }
                        reply(user.terrariums.id(request.params.terrarium_id)).code(200);
                    }
                });
        },
        config: {
            tags: ['webclient', 'api'],
            description: 'gets all the temperatures values from all the thingies form a certain terrarium',
            validate: {
                params: {
                    terrarium_id: Joi.string()
                        .required()
                        .description('Id of the Terrarium i want the temperatures of')
                },
                query: {
                    past: Joi.boolean()
                    /*from: Joi.date()
                        .description('Value from a certain date'),
                    to: Joi.date().description('Value to a certain date')*/
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
                .select('-terrariums.thingies.temperatures -terrariums.thingies.airQualities -terrariums.thingies.targetConfiguration -terrariums.thingies.thresholdViolations')
                .exec(function (err, user) {
                    if (err) {
                        console.log(err);
                    } else {
                        if (!request.query.past) {
                            user.terrariums.forEach(function (t) {
                                t.thingies.forEach(function (thingy) {
                                    thingy.humidities = thingy.humidities[thingy.humidities.length - 1]
                                })
                            });
                        }

                        reply(user.terrariums.id(request.params.terrarium_id)).code(200);
                    }
                });
        },
        config: {
            tags: ['webclient', 'api'],
            description: 'gets all the humidity values from all the thingies form a certain terrarium',
            validate: {
                params: {
                    terrarium_id: Joi.string()
                        .required()
                        .description('Id of the Terrarium i want the humidities of')
                },
                query: {
                    past: Joi.boolean()
                    /*from: Joi.date()
                        .description('Value from a certain date'),
                    to: Joi.date().description('Value to a certain date')*/
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
                .select('-terrariums.thingies.temperatures -terrariums.thingies.humidities -terrariums.thingies.targetConfiguration -terrariums.thingies.thresholdViolations')
                .exec(function (err, user) {
                    if (err) {
                        console.log(err);
                    } else {
                        if (!request.query.past) {
                            user.terrariums.forEach(function (t) {
                                t.thingies.forEach(function (thingy) {
                                    thingy.airQualities = thingy.airQualities[thingy.airQualities.length - 1]
                                })
                            });
                        }
                        reply(user.terrariums.id(request.params.terrarium_id)).code(200);
                    }
                });
        },
        config: {
            tags: ['webclient', 'api'],
            description: 'gets all the airquality values from all the thingies form a certain terrarium',
            validate: {
                params: {
                    terrarium_id: Joi.string()
                        .required()
                        .description('Id of the Terrarium i want the airqualities of')
                },
                query: {
                    past: Joi.boolean()
                    /*from: Joi.date()
                        .description('Value from a certain date'),
                    to: Joi.date().description('Value to a certain date')*/
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
                .exec(function (err, user) {
                    if (err) {
                        reply({'error': 'User not found'});
                    } else {
                        if (!request.query.past) {
                            user.terrariums.forEach(function (t) {
                                t.thingies.forEach(function (thingy) {
                                    thingy.humidities = thingy.humidities[thingy.humidities.length - 1];
                                    thingy.temperatures = thingy.temperatures[thingy.temperatures.length - 1];
                                    thingy.airQualities = thingy.airQualities[thingy.airQualities.length - 1];
                                })
                            });
                        }
                        reply(user.terrariums.id(request.params.terrarium_id)
                            .thingies.id(request.params.thingy_id)).code(200);
                    }
                });
        },
        config: {
            tags: ['webclient', 'api'],
            description: 'gets all the values that get measured in a certain terrarium with a certain thingy',
            validate: {
                params: {
                    terrarium_id: Joi.string()
                        .required()
                        .description('Id of the Terrarium i want the values of'),
                    thingy_id: Joi.string()
                        .required()
                        .description('Id of the Thingy i want the values of')
                },
                query: {
                    past: Joi.boolean()
                    /*from: Joi.date()
                        .description('Value from a certain date'),
                    to: Joi.date().description('Value to a certain date')*/
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
                .select('-terrariums.thingies.humidities -terrariums.thingies.airQualities -terrariums.thingies.targetConfiguration -terrariums.thingies.thresholdViolations')
                .exec(function (err, user) {
                    if (err) {
                        reply({'error': 'User not found'});
                    } else {
                        if (!request.query.past) {
                            user.terrariums.forEach(function (t) {
                                t.thingies.forEach(function (thingy) {
                                    thingy.temperatures = thingy.temperatures[thingy.temperatures.length - 1];
                                })
                            });
                        }

                        reply(user.terrariums.id(request.params.terrarium_id)
                            .thingies.id(request.params.thingy_id)).code(200);
                    }
                });
        },
        config: {
            tags: ['webclient', 'api'],
            description: 'gets the temperature that get measured in a certain terrarium with a certain thingy',
            validate: {
                params: {
                    terrarium_id: Joi.string()
                        .required()
                        .description('Id of the Terrarium i want the temperature of'),
                    thingy_id: Joi.string()
                        .required()
                        .description('Id of the Thingy i want the temperature of')
                },
                query: {
                    past: Joi.boolean()
                    /*from: Joi.date()
                        .description('Value from a certain date'),
                    to: Joi.date().description('Value to a certain date')*/
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
                .select('-terrariums.thingies.temperatures -terrariums.thingies.airQualities -terrariums.thingies.targetConfiguration -terrariums.thingies.thresholdViolations')
                .exec(function (err, user) {
                    if (err) {
                        reply({'error': 'User not found'});
                    } else {
                        if (!request.query.past) {
                            user.terrariums.forEach(function (t) {
                                t.thingies.forEach(function (thingy) {
                                    thingy.humidities = thingy.humidities[thingy.humidities.length - 1];
                                })
                            });
                        }

                        reply(user.terrariums.id(request.params.terrarium_id)
                            .thingies.id(request.params.thingy_id)).code(200);
                    }
                });
        },
        config: {
            tags: ['webclient', 'api'],
            description: 'gets the humidity that get measured in a certain terrarium with a certain thingy',
            validate: {
                params: {
                    terrarium_id: Joi.string()
                        .required()
                        .description('Id of the Terrarium i want the humidity of'),
                    thingy_id: Joi.string()
                        .required()
                        .description('Id of the Thingy i want the humidity of')
                },
                query: {
                    past: Joi.boolean()
                    /*from: Joi.date()
                        .description('Value from a certain date'),
                    to: Joi.date().description('Value to a certain date')*/
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
                .select('-terrariums.thingies.humidities -terrariums.thingies.temperatures -terrariums.thingies.targetConfiguration -terrariums.thingies.thresholdViolations')
                .exec(function (err, user) {
                    if (err) {
                        reply({'error': 'User not found'});
                    } else {
                        if (!request.query.past) {
                            user.terrariums.forEach(function (t) {
                                t.thingies.forEach(function (thingy) {
                                    thingy.airQualities = thingy.airQualities[thingy.airQualities.length - 1];
                                })
                            });
                        }

                        reply(user.terrariums.id(request.params.terrarium_id)
                            .thingies.id(request.params.thingy_id)).code(200);
                    }
                });

        },
        config: {
            tags: ['webclient', 'api'],
            description: 'gets the airquality that get measured in a certain terrarium with a certain thingy',
            validate: {
                params: {
                    terrarium_id: Joi.string()
                        .required()
                        .description('Id of the Terrarium i want the airquality of'),
                    thingy_id: Joi.string()
                        .required()
                        .description('Id of the Thingy i want the airquality of')
                },
                query: {
                    past: Joi.boolean()
                    /*from: Joi.date()
                        .description('Value from a certain date'),
                    to: Joi.date().description('Value to a certain date')*/
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