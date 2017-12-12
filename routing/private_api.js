const Joi = require('joi');

const HandlerAllTerrariums = require('./handlerAllTerrariums');
const HandlerTerrarium = require('./handlerSpecificTerrarium');
const HandlerThingy = require('./handlerSpecificThingy');


const schemas = require('./helper/responseSchemas');

var createPrivateAPI = (server) => {
    /**
     * ALL TERRARIUMS
     */
    server.route({
        method: 'GET',
        path: '/terrariums',
        handler: HandlerAllTerrariums.terrariums,
        config: {
            tags: ['webclient', 'api'],
            description: 'Gets all terrariums of a user',
            auth: 'jwt',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success',
                            schema: Joi.object({
                                _id: Joi.string(),
                                terrariums: Joi.array().items(Joi.object({
                                        _id: Joi.string(),
                                        name: Joi.string()
                                    })
                                )
                            }).label('Result')
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/terrariums/values',
        handler: HandlerAllTerrariums.terrariumsValues,
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
            auth: 'jwt',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success',
                            schema: Joi.object({
                                "_id": Joi.string(),
                                "name": Joi.string(),
                                "thingies": Joi.array().items(schemas.thingyWithAll)
                            }).label('Result')
                        }
                    }
                }
            }
        }
    });

    //TODO validation and schema
    server.route({
        method: 'GET',
        path: '/terrariums/configurations',
        handler: HandlerAllTerrariums.terrariumsConfigurations,
        config: {
            tags: ['webclient', 'api'],
            description: 'Gets the configuration from all Thingies in all terrariums of a user',
            validate: {
                // TODO: Validation
            },
            auth: 'jwt',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success',
                            //TODO: schema:
                        }
                    }
                }
            }
        }
    });

    //TODO validation and schema
    server.route({
        method: 'GET',
        path: '/terrariums/violations',
        handler: HandlerAllTerrariums.terrariumsViolations,
        config: {
            tags: ['webclient', 'api'],
            description: 'Gets all threshold violations from all Thingies in all terrariums of a user',
            validate: {
                // TODO: Validation
            },
            auth: 'jwt',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success',
                            //ToDo: schema
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/terrariums/temperature',
        handler: HandlerAllTerrariums.terrariumsTemperature,
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
            auth: 'jwt',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success',
                            schema: Joi.array().items({
                                "_id": Joi.string(),
                                "name": Joi.string(),
                                "thingies": Joi.array().items(schemas.thingyWithTemperatures)
                            }).label('Result')
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/terrariums/humidity',
        handler: HandlerAllTerrariums.terrariumsHumidity,
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
            auth: 'jwt',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success',
                            schema: Joi.array().items({
                                "_id": Joi.string(),
                                "name": Joi.string(),
                                "thingies": Joi.array().items(schemas.thingyWithHumidities)
                            }).label('Result')

                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/terrariums/airquality',
        handler: HandlerAllTerrariums.terrariumsAirquality,
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
            auth: 'jwt',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success',
                            schema: Joi.array().items({
                                "_id": Joi.string(),
                                "name": Joi.string(),
                                "thingies": Joi.array().items(schemas.thingyWithAirQualities)
                            }).label('Result')
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
        handler: HandlerTerrarium.terrariumThingies,
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
            auth: 'jwt',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success'
                            //schema:""

                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/terrarium/{terrarium_id}/values',
        handler: HandlerTerrarium.terrariumValues,
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
            auth: 'jwt',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success',
                            schema: Joi.object({
                                "_id": Joi.string(),
                                "name": Joi.string(),
                                "thingies": Joi.array().items(schemas.thingyWithAll)
                            }).label('Result')
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/terrarium/{terrarium_id}/temperatures',
        handler: HandlerTerrarium.terrariumTemperatures,
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
            auth: 'jwt',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success',
                            schema: Joi.object({
                                "_id": Joi.string(),
                                "name": Joi.string(),
                                "thingies": Joi.array().items(schemas.thingyWithTemperatures)
                            }).label('Result')
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/terrarium/{terrarium_id}/configurations',
        handler: HandlerTerrarium.terrariumConfigurations,
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
                    // TODO: Query
                }
            },
            auth: 'jwt',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success'
                            //ToDO schema:
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/terrarium/{terrarium_id}/violations',
        handler: HandlerTerrarium.terrariumViolations,
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
                    // TODO: Query
                }
            },
            auth: 'jwt',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success'
                            //ToDO schema:
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/terrarium/{terrarium_id}/humidities',
        handler: HandlerTerrarium.terrariumHumidities,
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
            auth: 'jwt',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success',
                            schema: Joi.object({
                                "_id": Joi.string(),
                                "name": Joi.string(),
                                "thingies": Joi.array().items(schemas.thingyWithHumidities)
                            }).label('Result')
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/terrarium/{terrarium_id}/airqualities',
        handler: HandlerTerrarium.terrariumAirqualities,
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
            auth: 'jwt',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success',
                            schema: Joi.object({
                                "_id": Joi.string(),
                                "name": Joi.string(),
                                "thingies": Joi.array().items(schemas.thingyWithAirQualities)
                            }).label('Result')
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
        handler: HandlerThingy.thingyValues,
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
            auth: 'jwt',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success'
                            //ToDO schema:
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/terrarium/{terrarium_id}/thingies/{thingy_id}/configuration',
        handler: HandlerThingy.thingyConfiguration,
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
            auth: 'jwt',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success'
                            //ToDO schema:
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/terrarium/{terrarium_id}/thingies/{thingy_id}/violations',
        handler: HandlerThingy.thingyViolations,
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
            auth: 'jwt',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success'
                            //ToDO schema:
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/terrarium/{terrarium_id}/thingies/{thingy_id}/temperature',
        handler: HandlerThingy.thingyTemperature,
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
            auth: 'jwt',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success'
                            //ToDO schema:
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/terrarium/{terrarium_id}/thingies/{thingy_id}/humidity',
        handler: HandlerThingy.thingyHumidity,
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
            auth: 'jwt',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success'
                            //ToDo schema:
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/terrarium/{terrarium_id}/thingies/{thingy_id}/airquality',
        handler: HandlerThingy.thingyAirquality,
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
            auth: 'jwt',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success'
                            //ToDo schema:
                        }
                    }
                }
            }
        }
    });
};

module.exports = createPrivateAPI;
