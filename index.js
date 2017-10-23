const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Joi = require('joi');
const Mongoose = require('mongoose');

var dbUrl = 'mongodb://localhost:27017/thingy-api-blue';
//check if we are in docker compose or not
process.argv.forEach(function (t) {
    if(t === '-prod'){
        dbUrl = 'mongodb://mongo:27017/thingy-api-blue';
    }
});

console.log("db url used: " +dbUrl);

//how many times we tried to connect to the db
var attempts = 0;
var mongoOptions = {useMongoClient: true,
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500 // Reconnect every 500ms
};

//the wait loop for the db connection
var createDbCallback = function(err) {
    if(!err){
        console.log("Database connection established!");
        return;
    }
    console.log(err);
    attempts++;
    console.log("attempts: " + attempts);
    setTimeout(function(){
        Mongoose.connect(dbUrl, mongoOptions, function (error) {
            createDbCallback(error)
        });
    }, 2000);
};

//try to make a connection
createDbCallback("first");

//the db connection
var db = Mongoose.connection;

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
    Vision,
    {
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

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply.view('index');
    },
    config: {
        tags: ['api'],
        description:
            'gets the index',
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

server.start((err) => {
    console.log('Server running at:', server.info.uri);
});
