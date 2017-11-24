const Mongoose = require("mongoose");
const isDocker = require('is-docker');
var fs = require('fs');

var create = function()
{
	var dbUrl;

	// Check if the process is running inside a Docker container
	if (isDocker())
	{
		console.log('Running inside a Docker container');
		dbUrl = 'mongodb://mongo:27017/thingy-api-blue';
	}
	else
	{
		console.log('NOT running inside a Docker container');
		dbUrl = 'mongodb://localhost:27017/thingy-api-blue';
	}

	console.log("DB URL used: " + dbUrl);

	var mongoOptions =
	{
		useMongoClient: true,
		reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
		reconnectInterval: 500, // Reconnect every 500ms
	};

	// The wait loop for the DB connection
	function createConnection(dbUrl, mongoOptions)
	{
		var db = Mongoose.connect(dbUrl, mongoOptions);

		db.on('error', function(err)
		{
			// If first connect fails because mongod is down, try again later.
			// This is only needed for first connect, not for runtime reconnects.
			// See: https://github.com/Automattic/mongoose/issues/5169
			if (err.message && err.message.match(/failed to connect to server .* on first connect/))
			{
				console.error(new Date(), String(err));

				// Wait for a bit, then try to connect again
				setTimeout(function()
				{
					console.log("Retrying first connect ...");
					db.openUri(dbUrl).catch(() => {});
					// Why the empty catch?
					// Well, errors thrown by db.open() will also be passed to .on('error'),
					// so we can handle them there, no need to log anything in the catch here.
					// But we still need this empty catch to avoid unhandled rejections.
				}, 20000);
			}
			else
			{
				// Some other error occurred. Log it.
				console.error(new Date(), String(err));
			}
		});

		db.once('open', function()
		{
			console.log("Connection to DB established.");
		});
	}

	createConnection(dbUrl, mongoOptions);

	// The DB connection
	var db = Mongoose.connection;

	db.on('connected', function()
	{
		console.log('MongoDB connected!');
	});

	db.once('open', function()
	{
		console.log('MongoDB connection opened!');
	});

	// Hook if the DB loses connection (mongo container is not reachable)
	db.on('disconnected', function()
	{
		console.log('MongoDB disconnected!');
	});

	// Hook if we reconnect to the DB server
	db.on('reconnected', function()
	{
		console.log('MongoDB reconnected!');
	});

	// If the Node process ends, close the Mongoose connection
	db.on('SIGINT', function()
	{
		mongoose.connection.close(function()
		{
			console.warn('Mongoose disconnected on app interruption');
			process.exit(0);
		});
	});

	// If the Node process ends, close the Mongoose connection
	db.on('SIGTERM', function()
	{
		mongoose.connection.close(function()
		{
			console.warn('Mongoose disconnected on app termination');
			process.exit(0);
		});
	});
};

module.exports = create();
