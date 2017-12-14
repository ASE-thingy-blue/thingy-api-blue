const Mongoose = require('mongoose');
const User = Mongoose.model('User');
const Jwt = require('jwt-simple');
const Joi = require('joi');

// Returns a promise. Use it as:
/*
require('./session').then(value =>
{
  // Use value here
});
*/
const Session = require('./session');

var createPublicAPI = (server) => {
    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            reply.view('index');
        },
        config: {
            tags: ['webclient'],
            description: 'gets the index',
            auth: false,
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
        config: { auth: false },
        handler: {
            directory: {
                path: 'web-client',
                listing: true
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/authenticate',
        handler: function (request, reply)
        {
            User.findOne({name: request.payload.name}, function (err, user)
            {
                if (err) throw err;

                if (!user)
                {
                    return reply({success: false, message: 'Authentication failed. Incorrect username.'}).code(401);
                }
                // Check if password matches
                user.verifyPassword(request.payload.password, function (isValidPassword)
                {
                    if (isValidPassword)
                    {
                        // If user is found and password is correct, create a token
                        let expires = (Date.now() / 1000) + 60 * 30; // Expire in 30 minutes
                        let nbf = Date.now() / 1000;
                        Session.then(tokenKey =>
                        {
                            var token = Jwt.encode({nbf: nbf, exp: expires, 'userID': user._id, 'userName': user.name, 'mailAddress': user.mailAddress}, tokenKey);
                            // Return the information including token as JSON
                            return reply({success: true, token: `${token}`}).code(200);
                        });
                    }
                    else
                    {
                        return reply({success: false, message: 'Authentication failed. Incorrect password.'}).code(401);
                    }
                });
            });
        },
        config: {
            auth: false,
            tags: ['webclient', 'api'],
            description: 'Log in',
            validate: {
                payload: {
                    name: Joi.string().description('Name'),
                    password: Joi.string().description('Password')
                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success',
                            schema: Joi.object({
                                success: Joi.boolean(),
                                token: Joi.string()
                            }).label('Result')
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/signup',
        handler: function (request, reply) {
            if (!request.payload.name || !request.payload.password) {
                reply({success: false, message: 'Please provide username and password.'}).code(400);
            } else {
                if (request.payload.password !== request.payload.repassword)
                {
                    return reply({success: false, message: 'Passwords do not match.'}).code(400);
                }

                User.find({name: request.payload.name}).count(function(err, countName) {
                    if (err) {
                        return reply({success: false, message: 'Error creating new user.'}).code(500);
                    }
                    if (countName !== 0) {
                        return reply({success: false, message: 'Username already taken.'}).code(500);
                    } else {
                        User.find({mailAddress: request.payload.email}).count(function(err, countEmail) {
                            if (err) {
                                return reply({success: false, message: 'Error creating new user.'}).code(500);
                            }

                            if (countEmail !== 0) {
                                return reply({success: false, message: 'E-Mail already taken.'}).code(500);
                            } else {
                                var newUser = new User({
                                    name: request.payload.name,
                                    mailAddress: request.payload.email,
                                    password: request.payload.password
                                });
                                // Save the user
                                newUser.save(function (err) {
                                    if (err) {
                                        return reply({success: false, message: 'Error creating new user.'}).code(500);
                                    }
                                    reply({success: true, message: 'Successfully created new user.'}).code(201);
                                });
                            }
                        });
                    }
                });
            }
        },
        config: {
            auth: false,
            tags: ['webclient', 'api'],
            description: 'Sign up',
            validate: {
                payload: {
                    name: Joi.string().description('Name'),
                    email: Joi.string().email().description('E-Mail'),
                    password: Joi.string().description('Password'),
                    repassword: Joi.string().description('retype your password')
                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success',
                            schema: Joi.object({
                                success: Joi.boolean(),
                                token: Joi.string()
                            }).label('Result')
                        }
                    }
                }
            }
        }
    });
};

module.exports = createPublicAPI;
