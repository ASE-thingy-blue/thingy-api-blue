"use strict";

const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const HapiJWTSimple = require('hapi-auth-jwt-simple');
const Crypto = require('crypto');
const Jwt = require('jwt-simple');
const Fs = require('fs');
const Path = require('path');

// Load model
require('./model/makeModel');
var User = Mongoose.model('User');

// Create the DB connection
require("./model/helper/databaseConnection");

// Returns a promise. Use it as:
/*
require('./routing/session').then(value =>
{
  // Use value here
});
*/
const Session = require('./routing/session');

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
  secureOptions: Crypto.constants.SSL_OP_NO_SSLv2 | Crypto.constants.SSL_OP_NO_SSLv3 | Crypto.constants.SSL_OP_NO_TLSv1 | Crypto.constants.SSL_OP_NO_TLSv1_1,
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
    },
    securityDefinitions: {
        'jwt': {
            'type': 'apiKey',
            'name': 'Authorization',
            'in': 'header'
        }
    },
    security: [{ 'jwt': [] }],
    auth: false
};

const validateToken = function (token, request, callback)
{
    Session.then(tokenKey =>
    {
        callback(null, true, Jwt.decode(token, tokenKey));
    })
    .catch(error =>
    {
        console.error(error.toString());
        callback(null, false);
    });
};

const registerAuthRoutes = function (err)
{
    if (err)
    {
        console.error(err);
    }
    Session.then(tokenKey =>
    {
        server.auth.strategy('jwt', 'jwt',
        {
            mode: 'required',
            validateFunc: validateToken,
            verifyOptions: { ignoreExpiration: false, algorithms: ['HS256'] }
        });
        server.auth.default('jwt');

        // Register public API paths
        require('./routing/public_api')(server);
        // Register Thingy API paths
        require('./routing/thingy_api')(server);
        // Register private API paths
        require('./routing/private_api')(server);
    });

    server.start(() => {
        console.log('Server running at: ', server.info.uri);
    });
};

server.register([
    Inert,
    Vision, {
        register: HapiSwagger,
        options: swaggerOptions
    },
    HapiJWTSimple
], registerAuthRoutes);

server.views({
    engines: {
        html: require('ejs')
    },
    relativeTo: __dirname,
    path: Path.join(__dirname, 'templates')
});
