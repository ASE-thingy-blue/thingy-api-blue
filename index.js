const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Mongoose = require('mongoose');
const Constants = require('constants');
const Jwt = require('jwt-simple');
const Fs = require('fs');
const Path = require('path');

// Load model
require('./model/makeModel');
var User = Mongoose.model('User');

// Create the DB connection
require("./model/helper/databaseConnection");

// Quirk to have synchronously loaded modules with require() that use return values loaded asynchronously
// It is not possible to write:
// const Session = require('./routing/session');
// Session is always undefined here because this line will get evaluated before that value is available
var Session;
require('./routing/session').then(hashKey =>
{
    Session = { 'tokenKey' : hashKey };
});

var tlsoptions = {
  key: Fs.readFileSync(Path.join('certs', 'ThingyAPI.epk')),
  cert: Fs.readFileSync(Path.join('certs', 'ThingyAPI.cer')),

  // This is necessary if the client uses the self-signed certificate.
  ca: [ Fs.readFileSync(Path.join('certs', 'ThingyRootCA.cer')) ],

  ciphers: "ECDHE-RSA-AES128-GCM-SHA256:\
            ECDHE-RSA-AES256-GCM-SHA384:\
            DHE-RSA-AES128-GCM-SHA256:\
            DHE-RSA-AES256-GCM-SHA384:\
            ECDHE-RSA-AES128-SHA256:\
            DHE-RSA-AES128-SHA256:\
            ECDHE-RSA-AES256-SHA384:\
            DHE-RSA-AES256-SHA384:\
            ECDHE-RSA-AES256-SHA256:\
            DHE-RSA-AES256-SHA256:\
            HIGH:\
            !aNULL:\
            !eNULL:\
            !EXPORT:\
            !DES:\
            !3DES:\
            !RC4:\
            !MD5:\
            !PSK:\
            !SRP:\
            !CAMELLIA:\
            !SHA1:",
  honorCipherOrder: true,
  // Disable SSL 2, SSL 3, TLS 1.0 and TLS 1.1
  secureOptions: Constants.SSL_OP_NO_SSLv2 | Constants.SSL_OP_NO_SSLv3 | Constants.SSL_OP_NO_TLSv1 | Constants.SSL_OP_NO_TLSv1_1,
  // Force TLS version 2
  secureProtocol: 'TLSv1_2_server_method'
};

const server = new Hapi.Server();

server.connection({
    address: '0.0.0.0', // Listen to all available network interfaces
    port: 8080,
    tls: tlsoptions,
    routes: {cors: true}
});

const swaggerOptions = {
    info: {
        'title': 'thingy-api-blue',
        'version': '1.0.0',
        'description': 'thingy-api-blue'
    }
};

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
    path: Path.join(__dirname, 'templates')
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
                    var token = Jwt.encode({nbf: nbf, exp: expires, "userID" : user._id, "userName" : user.name, "mailAddress" : user.mailAddress}, Session.tokenKey);
                    // Return the information including token as JSON
                    return reply({success: true, token: `${token}`}).code(200);
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

// Register public API paths
require('./routing/public_api')(server);

/***********************************************************************************************************************
 *** START THINGY API
 **********************************************************************************************************************/
require('./routing/thingy_api')(server);

if (!module.parent) {
    server.start((err) => {
        console.log('Server running at: ', server.info.uri);
    });
}

module.exports = server;
