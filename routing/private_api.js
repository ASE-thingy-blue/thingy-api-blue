const Joi = require('joi');

const HandlerAllTerrariums = require('./handlerAllTerrariums');
const HandlerTerrarium = require('./handlerSpecificTerrarium');
const HandlerThingy = require('./handlerSpecificThingy');
const HandlerUser = require('./handlerUser');

const schemas = require('./helper/responseSchemas');

var createPrivateAPI = (server) => {
    /**
     * USER
     */
    server.route({
        method: 'GET',
        path: '/user',
        handler: HandlerUser.getUser,
        config: {
            tags: ['webclient', 'api'],
            description: 'Get the user',
            auth: 'jwt',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success',
                            schema: Joi.object({
                                name: Joi.string(),
                                mailAddress: Joi.string().email()
                            }).label('Result')
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'PUT',
        path: '/user',
        handler: HandlerUser.updateUser,
        config: {
            tags: ['webclient', 'api'],
            description: 'Updates the user',
            auth: 'jwt',
            validate: {
                payload: Joi.object({
                    mailAddress: Joi.string().email(),
                    password: Joi.string(),
                    repassword: Joi.string()
                }).with('password', 'repassword')
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success',
                            schema: Joi.object({
                                name: Joi.string(),
                                mailAddress: Joi.string().email()
                            }).label('Result')
                        }
                    }
                }
            }
        }
    });

    /**
     * ALL TERRARIUMS
     */
    server.route({
        method: 'POST',
        path: '/terrarium',
        handler: HandlerTerrarium.terrariumCreate,
        config: {
            tags: ['webclient', 'api'],
            description: 'Creates a new terrarium with out of the given payload',
            validate: {
                payload: {
                    name: Joi.string()
                        .required()
                        .description('Name of the new terrarium'),
                    description: Joi.string()
                        .description('Description of the terrarium'),
                    callbackAddress: Joi.string()
                        .description('A callback adress if there is one')
                }
            },
            auth: 'jwt',
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
        path: '/terrarium',
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
                            schema: Joi.array().items({
                                "_id": Joi.string(),
                                "name": Joi.string(),
                                "thingies" : Joi.array().items(schemas.thingyWithAll),
                                "isDefault": Joi.boolean()
                            }).label('Result')
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/terrarium/configurations',
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
                            description: 'Success'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/terrarium/violations',
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
                            description: 'Success'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/terrarium/temperature',
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
                                "thingies": Joi.array().items(schemas.thingyWithTemperatures),
                                "isDefault": Joi.boolean()
                            }).label('Result')
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/terrarium/humidity',
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
                                "thingies": Joi.array().items(schemas.thingyWithHumidities),
                                "isDefault": Joi.boolean()
                            })
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/terrarium/airquality',
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
                                "thingies": Joi.array().items(schemas.thingyWithAirQualities),
                                "isDefault": Joi.boolean()
                            })
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
        path: '/terrarium/{terrariumId}',
        handler: HandlerTerrarium.terrariumValues,
        config: {
            tags: ['webclient', 'api'],
            description: 'Gets all values from all Thingies form a certain terrarium',
            validate: {
                params: {
                    terrariumId: Joi.string()
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
                                "thingies": Joi.array().items(schemas.thingy),
                                "isDefault": Joi.boolean()
                            })
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'PUT',
        path: '/terrarium/{terrariumId}',
        handler: HandlerTerrarium.terrariumUpdate,
        config: {
            tags: ['webclient', 'api'],
            description: 'Updates a certain terrarium',
            validate: {
                params: {
                    terrariumId: Joi.string()
                        .required()
                        .description('ID of the terrarium')
                },
                payload: {
                    description: Joi.string().description('The description of the terrarium'),
                    name: Joi.string().description('The name of the terrarium')
                }
            },
            auth: 'jwt',
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
        method: 'DELETE',
        path: '/terrarium/{terrariumId}',
        handler: HandlerTerrarium.terrariumDelete,
        config: {
            tags: ['webclient', 'api'],
            description: 'Deletes a given terrarium',
            validate: {
                params: {
                    terrariumId: Joi.string()
                        .required()
                        .description('ID of the terrarium I want to delete')
                }
            },
            auth: 'jwt',
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
        path: '/terrarium/{terrariumId}/thingies',
        handler: HandlerTerrarium.terrariumThingies,
        config: {
            tags: ['webclient', 'api'],
            description: 'Gets all Thingies of a certain terrarium',
            validate: {
                params: {
                    terrariumId: Joi.string()
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
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/terrarium/{terrariumId}/temperatures',
        handler: HandlerTerrarium.terrariumTemperatures,
        config: {
            tags: ['webclient', 'api'],
            description: 'Gets all temperatures values from all Thingies form a certain terrarium',
            validate: {
                params: {
                    terrariumId: Joi.string()
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
                            "thingies": Joi.array().items(schemas.thingyWithTemperatures),
                            "isDefault": Joi.boolean()
                        })
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/terrarium/{terrariumId}/configurations',
        handler: HandlerTerrarium.terrariumConfigurations,
        config: {
            tags: ['webclient', 'api'],
            description: 'Gets the configurations from all Thingies form a certain terrarium',
            validate: {
                params: {
                    terrariumId: Joi.string()
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
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/terrarium/{terrariumId}/violations',
        handler: HandlerTerrarium.terrariumViolations,
        config: {
            tags: ['webclient', 'api'],
            description: 'Gets the threshold violations from all Thingies form a certain terrarium',
            validate: {
                params: {
                    terrariumId: Joi.string()
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
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/terrarium/{terrariumId}/humidities',
        handler: HandlerTerrarium.terrariumHumidities,
        config: {
            tags: ['webclient', 'api'],
            description: 'Gets all humidity values from all Thingies form a certain terrarium',
            validate: {
                params: {
                    terrariumId: Joi.string()
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
                                "thingies": Joi.array().items(schemas.thingyWithHumidities),
                                "isDefault": Joi.boolean()
                            })
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/terrarium/{terrariumId}/airqualities',
        handler: HandlerTerrarium.terrariumAirqualities,
        config: {
            tags: ['webclient', 'api'],
            description: 'Gets all airquality values from all Thingies form a certain terrarium',
            validate: {
                params: {
                    terrariumId: Joi.string()
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
                                "thingies": Joi.array().items(schemas.thingyWithAirQualities),
                                "isDefault": Joi.boolean()
                            })
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
        path: '/terrarium/{terrariumId}/thingies/{thingyId}',
        handler: HandlerThingy.thingyValues,
        config: {
            tags: ['webclient', 'api'],
            description: 'Gets all values that are measured in a certain terrarium with a certain Thingy',
            validate: {
                params: {
                    terrariumId: Joi.string()
                        .required()
                        .description('ID of the terrarium I want the values from'),
                    thingyId: Joi.string()
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
                            description: 'Success',
                            schema: schemas.thingyWithAll
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'PATCH',
        path: '/terrarium/{terrariumId}/thingies/{thingyId}',
        handler: HandlerThingy.thingyMove,
        config: {
            tags: ['webclient', 'api'],
            description: 'Moves a certain thingy to another terrarium',
            validate: {
                params: {
                    terrariumId: Joi.string()
                        .required()
                        .description('ID of the terrarium'),
                    thingyId: Joi.string()
                        .required()
                        .description('ID of the Thingy I want to update')
                },
                payload: {
                    terrarium: Joi.string().description('The new terrarium of the thingy').required()
                }
            },
            auth: 'jwt',
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
	method: 'PUT',
	path: '/terrarium/{terrariumId}/thingies/{thingyId}/configuration',
	handler: HandlerThingy.configUpdate,
	config: {
            tags: ['webclient', 'api'],
            description: 'Updates the trigger configuration for a certain Thingy',
            validate: {
                params: {
                    terrariumId: Joi.string()
                        .required()
                        .description('ID of the terrarium'),
                    thingyId: Joi.string()
                        .required()
                        .description('ID of the Thingy I want to update')
                },
            },
            auth: 'jwt',
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
        method: 'PUT',
        path: '/terrarium/{terrariumId}/thingies/{thingyId}',
        handler: HandlerThingy.thingyUpdate,
        config: {
            tags: ['webclient', 'api'],
            description: 'Updates a certain thingy',
            validate: {
                params: {
                    terrariumId: Joi.string()
                        .required()
                        .description('ID of the terrarium'),
                    thingyId: Joi.string()
                        .required()
                        .description('ID of the Thingy I want to update')
                },
                payload: {
                    description: Joi.string().description('The description of the thingy')
                }
            },
            auth: 'jwt',
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
        method: 'DELETE',
        path: '/terrarium/{terrariumId}/thingies/{thingyId}',
        handler: HandlerThingy.thingyDelete,
        config: {
            tags: ['webclient', 'api'],
            description: 'Deletes a certain thingy in a given terrarium',
            validate: {
                params: {
                    terrariumId: Joi.string()
                        .required()
                        .description('ID of the terrarium I to delete the thingy'),
                    thingyId: Joi.string()
                        .required()
                        .description('ID of the Thingy I want to delete')
                }
            },
            auth: 'jwt',
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
        path: '/terrarium/{terrariumId}/thingies/{thingyId}/configuration',
        handler: HandlerThingy.thingyConfiguration,
        config: {
            tags: ['webclient', 'api'],
            description: 'Gets the configuration of a certain Thingy',
            validate: {
                params: {
                    terrariumId: Joi.string()
                        .required()
                        .description('ID of the terrarium I want the Thingy configuration from'),
                    thingyId: Joi.string()
                        .required()
                        .description('ID of the Thingy I want the configuration from')
                }
            },
            auth: 'jwt',
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
        path: '/terrarium/{terrariumId}/thingies/{thingyId}/violations',
        handler: HandlerThingy.thingyViolations,
        config: {
            tags: ['webclient', 'api'],
            description: 'Gets the threshold violations of a certain Thingy',
            validate: {
                params: {
                    terrariumId: Joi.string()
                        .required()
                        .description('ID of the terrarium I want the threshold violations from'),
                    thingyId: Joi.string()
                        .required()
                        .description('ID of the Thingy I want the threshold violations from')
                }
            },
            auth: 'jwt',
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
        path: '/terrarium/{terrariumId}/thingies/{thingyId}/temperature',
        handler: HandlerThingy.thingyTemperature,
        config: {
            tags: ['webclient', 'api'],
            description: 'Gets the temperature that is measured in a certain terrarium with a certain Thingy',
            validate: {
                params: {
                    terrariumId: Joi.string()
                        .required()
                        .description('ID of the terrarium I want the temperature from'),
                    thingyId: Joi.string()
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
                            description: 'Success',
                            schema: schemas.thingyWithTemperatures
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/terrarium/{terrariumId}/thingies/{thingyId}/humidity',
        handler: HandlerThingy.thingyHumidity,
        config: {
            tags: ['webclient', 'api'],
            description: 'Gets the humidity that is measured in a certain terrarium with a certain Thingy',
            validate: {
                params: {
                    terrariumId: Joi.string()
                        .required()
                        .description('ID of the terrarium I want the humidity from'),
                    thingyId: Joi.string()
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
                            description: 'Success',
                            schema: schemas.thingyWithHumidities
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/terrarium/{terrariumId}/thingies/{thingyId}/airquality',
        handler: HandlerThingy.thingyAirquality,
        config: {
            tags: ['webclient', 'api'],
            description: 'Gets the airquality that is measured in a certain terrarium with a certain Thingy',
            validate: {
                params: {
                    terrariumId: Joi.string()
                        .required()
                        .description('ID of the terrarium I want the airquality from'),
                    thingyId: Joi.string()
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
                            description: 'Success',
                            schema: schemas.thingyWithAirQualities
                        }
                    }
                }
            }
        }
    });
};

module.exports = createPrivateAPI;
