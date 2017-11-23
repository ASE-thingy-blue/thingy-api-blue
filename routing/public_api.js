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
            //hardcode to test it
            //if no querystring
            User.findOne({name: "Joe Slowinski"}).select('-terrariums.thingies.targetConfiguration -terrariums.thingies.thresholdViolations')
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
            description: 'Gets all values from all Thingies in all terrariums of a user',
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
        path: '/terrariums/configurations',
        handler: function (request, reply) {
            //hardcode to test it
            //if no querystring
            User.findOne({name: "Joe Slowinski"}).select('-terrariums.thingies.humidities -terrariums.thingies.temperatures -terrariums.thingies.airQualities -terrariums.thingies.thresholdViolations')
                .exec(function (err, user) {
                    if (err) {
                        console.log(err);
                    } else {
                        reply(user.terrariums).code(200);
                    }
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
            //hardcode to test it
            //if no querystring
            User.findOne({name: "Joe Slowinski"}).select('-terrariums.thingies.humidities -terrariums.thingies.temperatures -terrariums.thingies.airQualities -terrariums.thingies.targetConfiguration')
                .exec(function (err, user) {
                    if (err) {
                        console.log(err);
                    } else {
                        reply(user.terrariums).code(200);
                    }
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
            description: 'Gets all temperature values from all Thingies in all terrariums of a user',
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
            description: 'Gets all humidity values from all Thingies in all terrariums of a user',
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
            description: 'Gets all airquality values from all Thingies in all terrariums of a user',
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
                        reply({'Error': 'User not found'}).code(404);
                    } else {
                        reply(user.terrariums.id(request.params.terrarium_id)).code(200);
                    }
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
            User.findOne({name: "Joe Slowinski"}).select("-terrariums.thingies.targetConfiguration -terrariums.thingies.thresholdViolations")
                .exec(function (err, user) {
                    if (err) {
                        reply({'Error': 'User not found'}).code(404);
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
            description: 'Gets all values from all Thingies form a certain terrarium',
            validate: {
                params: {
                    terrarium_id: Joi.string()
                        .required()
                        .description('ID of the terrarium I want the values from')
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
            description: 'Gets all temperatures values from all Thingies form a certain terrarium',
            validate: {
                params: {
                    terrarium_id: Joi.string()
                        .required()
                        .description('ID of the terrarium I want the temperature from')
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
        path: '/terrarium/{terrarium_id}/configurations',
        handler: function (request, reply) {
            User.findOne({name: "Joe Slowinski"})
                .select('-terrariums.thingies.humidities -terrariums.thingies.airQualities -terrariums.thingies.temperatures -terrariums.thingies.thresholdViolations')
                .exec(function (err, user) {
                    if (err) {
                        console.log(err);
                    } else {
                        reply(user.terrariums.id(request.params.terrarium_id)).code(200);
                    }
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
            User.findOne({name: "Joe Slowinski"})
                .select('-terrariums.thingies.humidities -terrariums.thingies.airQualities -terrariums.thingies.temperatures -terrariums.thingies.targetConfiguration')
                .exec(function (err, user) {
                    if (err) {
                        console.log(err);
                    } else {
                        reply(user.terrariums.id(request.params.terrarium_id)).code(200);
                    }
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
            description: 'Gets all humidity values from all Thingies form a certain terrarium',
            validate: {
                params: {
                    terrarium_id: Joi.string()
                        .required()
                        .description('ID of the terrarium I want the humidity from')
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
            description: 'Gets all airquality values from all Thingies form a certain terrarium',
            validate: {
                params: {
                    terrarium_id: Joi.string()
                        .required()
                        .description('ID of the terrarium I want the airquality from')
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
            User.findOne({name: "Joe Slowinski"}).select("-terrariums.thingies.targetConfiguration -terrariums.thingies.thresholdViolations")
                .exec(function (err, user) {
                    if (err) {
                        reply({'Error': 'User not found'}).code(404);
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
        path: '/terrarium/{terrarium_id}/thingies/{thingy_id}/configuration',
        handler: function (request, reply) {
            User.findOne({name: "Joe Slowinski"})
                .select('-terrariums.thingies.humidities -terrariums.thingies.airQualities -terrariums.thingies.temperatures -terrariums.thingies.thresholdViolations')
                .exec(function (err, user) {
                    if (err) {
                        reply({'Error': 'User not found'}).code(404);
                    } else {
                        reply(user.terrariums.id(request.params.terrarium_id)
                            .thingies.id(request.params.thingy_id)).code(200);
                    }
                });
        },
        config: {
            tags: ['webclient', 'api'],
            description: 'Gets the configuration of a certain Thingy',
            validate: {
                params: {
                    terrarium_id: Joi.string()
                        .required()
                        .description('Id of the Terrarium i want the thingy configuration of'),
                    thingy_id: Joi.string()
                        .required()
                        .description('Id of the Thingy i want the configuration of')
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
            User.findOne({name: "Joe Slowinski"})
                .select('-terrariums.thingies.humidities -terrariums.thingies.airQualities -terrariums.thingies.temperatures -terrariums.thingies.targetConfiguration')
                .exec(function (err, user) {
                    if (err) {
                        reply({'Error': 'User not found'}).code(404);
                    } else {
                        reply(user.terrariums.id(request.params.terrarium_id)
                            .thingies.id(request.params.thingy_id)).code(200);
                    }
                });
        },
        config: {
            tags: ['webclient', 'api'],
            description: 'Gets the threshold violations of a certain Thingy',
            validate: {
                params: {
                    terrarium_id: Joi.string()
                        .required()
                        .description('Id of the Terrarium i want the threshold violations of'),
                    thingy_id: Joi.string()
                        .required()
                        .description('Id of the Thingy i want the threshold violations of')
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
            User.findOne({name: "Joe Slowinski"})
                .select('-terrariums.thingies.humidities -terrariums.thingies.airQualities -terrariums.thingies.targetConfiguration -terrariums.thingies.thresholdViolations')
                .exec(function (err, user) {
                    if (err) {
                        reply({'Error': 'User not found'}).code(404);
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
                        reply({'Error': 'User not found'}).code(404);
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
                        reply({'Error': 'User not found'}).code(404);
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
     * Test Authentication skips checks
     */
    server.route({
        method: 'POST',
        path: '/authenticate',
        handler: function (request, reply) {
            let timestamp = "" + Math.floor(Date.now());
            reply({'success':true, 'message':"ok", 'token':timestamp}).code(200);
        }
    });
}

module.exports = createPublicAPI;
