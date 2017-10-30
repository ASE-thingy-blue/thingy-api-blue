const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Joi = require('joi');

// Create the DB connection
require("./model/helper/databaseConnection");

// URL Param Schemes
var thingyIdSchema = Joi.string().required().description('The Thingy UUID');
var sensorIdSchema = Joi.string().required().description('The Thingy Sensor');

const server = new Hapi.Server();
server.connection(
{
	host: '0.0.0.0',
	port: 8080,
	routes: {cors: true}
});

const swaggerOptions =
{
	info:
	{
		'title': 'thingy-api-blue',
		'version': '1.0.0',
		'description': 'thingy-api-blue'
	}
}

server.register(
[
	Inert,
	Vision,
	{
		register: HapiSwagger,
		options: swaggerOptions
	}
]);

server.views(
{
	engines:
	{
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
		tags: ['webclient', 'api'],
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

server.route(
{
	method: 'GET',
	path: '/static/{param*}',
	handler:
	{
		directory:
		{
			path: 'web-client',
			listing: true
		}
	}
});

/***********************************************************************************************************************
 *** START THINGY API
 **********************************************************************************************************************/
server.route(
{
	method: 'GET',
	path: '/thingy/{thingy_id}/setup',
	handler: function (request, reply)
	{
		var thingyId = request.params.thingy_id;

		// TODO: Get configuration from server by Thingy ID
		var setup =
		{
			temperature:
			{
				interval: 5000
			},
			pressure:
			{
				interval: 5000
			},
			humidity:
			{
				interval: 5000
			},
			color:
			{
				interval: 5000
			},
			gas:
			{
				mode: 3
			}
		};

		reply(setup).code(200);
	},
	config:
	{
		tags: ['thingy'],
		validate:
		{
			params:
			{
				thingy_id: thingyIdSchema
			}
		}
	}
});

server.route(
{
	method: 'GET',
	path: '/thingy/{thingy_id}/actuators/led',
	handler: function (request, reply)
	{
		var thingyId = request.params.thingy_id;

		// TODO: Get configuration from server by Thingy ID
		var led =
		{
			color : 8,
			intensity : 20,
			delay : 1
		};

		reply(led).code(200);
	},
	config:
	{
		tags: ['thingy'],
		validate:
		{
			params:
			{
				thingy_id: thingyIdSchema
			}
		}
	}
});

server.route(
{
	method: 'POST',
	path: '/thingy/{thingy_id}/sensors/{sensor_id}',
	handler: function (request, reply)
	{
		var thingyId = request.params.thingy_id;
		var sensorId = request.params.sensor_id;

		// TODO: Store data by Thingy and sensor
		console.log('Tingy: ' + thingyId);
		console.log('Sensor: ' + sensorId);
		console.log('Data: ' + request.payload);

		reply({success:true}).code(200);
	},
	config:
	{
		tags: ['thingy'],
		validate:
		{
			params:
			{
				thingy_id: thingyIdSchema,
				sensor_id: sensorIdSchema
			}
		}
	}
});

server.start((err) =>
{
	console.log('Server running at: ', server.info.uri);
});
