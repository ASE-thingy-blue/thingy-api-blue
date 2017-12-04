const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Mongoose = require('mongoose');
const Constants = require('constants');
const Fs = require('fs');
const Path = require('path');

// Load model
require('./model/makeModel');
var User = Mongoose.model('User');

// Create the DB connection
require("./model/helper/databaseConnection");

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
                    return reply({success: true}).code(200);
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


server.start((err) => {
    console.log('Server running at: ', server.info.uri);
});
