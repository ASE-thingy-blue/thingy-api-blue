const Mongoose = require("mongoose");

var create = function () {
    var dbUrl = 'mongodb://localhost:27017/thingy-api-blue';
    //check if we are in docker compose or not
    process.argv.forEach(function (t) {
        if (t === '-prod') {
            dbUrl = 'mongodb://mongo:27017/thingy-api-blue';
        }
    });

    console.log("db url used: " + dbUrl);

    //how many times we tried to connect to the db
    var attempts = 0;
    var mongoOptions = {
        useMongoClient: true,
        reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
        reconnectInterval: 500 // Reconnect every 500ms
    };

    //the wait loop for the db connection
    var createDbCallback = function (err) {
        if (!err) {
            console.log("Database connection established!");
            return;
        }
        console.log(err);
        attempts++;
        console.log("attempts: " + attempts);
        setTimeout(function () {
            Mongoose.connect(dbUrl, mongoOptions, function (error) {
                createDbCallback(error)
            });
        }, 2000);
    };

    //try to make a connection
    createDbCallback("first");

    //the db connection
    var db = Mongoose.connection;

    //hook if the db loses connection (mongo container is not reachable)
    db.on('disconnected', function() {
        console.log('MongoDB disconnected!');
    });
    //hook if we reconnect to the db server
    db.on('reconnected', function () {
        console.log('MongoDB reconnected!');
    });
};

module.exports = create();