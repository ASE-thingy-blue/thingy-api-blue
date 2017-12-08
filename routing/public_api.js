const Mongoose = require('mongoose');
const User = Mongoose.model('User');
const Jwt = require('jwt-simple');

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
        config: { auth: false },
        handler: function (request, reply)
        {
            User.findOne({name: request.payload.name}, function(err, user)
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
                            var token = Jwt.encode({nbf: nbf, exp: expires, "userID" : user._id, "userName" : user.name, "mailAddress" : user.mailAddress}, tokenKey);
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
        }
    });

    server.route({
        method: 'POST',
        path: '/signup',
        config: { auth: false },
        handler: function(request, reply) {
            if (!request.payload.name || !request.payload.password) {
            reply({success: false, message: 'Please provide username and password.'}).code(400);
            } else {
                if (request.payload.password !== request.payload.repassword)
                {
                    return reply({success: false, message: 'Passwords do not match.'}).code(400);
                }
                var newUser = new User({
                    name: request.payload.name,
                    mailAddress: request.payload.email,
                    password: request.payload.password
                });
                // Save the user
                newUser.save(function(err) {
                    if (err) {
                        return reply({success: false, message: 'Error creating new user.'}).code(500);
                    }
                    reply({success: true, message: 'Successfully created new user.'}).code(201);
                });
            }
        }
    });
};

module.exports = createPublicAPI;
