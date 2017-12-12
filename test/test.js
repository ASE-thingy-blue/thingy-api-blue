//-----SETUP-----
// install ava as global package
// execute:
// npm install --global ava

//all test in the "test" folder will get executed
//you can execute the files via npm test in the route folder

//!!!!!!!!!!!!DONT FORGET TO START THE DATABASE!!!!!!!
//test values get injected!

import test from 'ava';
import server from '../index';
import schemas from '../routing/helper/responseSchemas';

const Mongoose = require('mongoose');
const Joi = require('joi');
let User = Mongoose.model('User');
let token;
let terrariumId;
let thingyId;

//inject test data to the database
//and makes the token available as class variable
test.before(t => {
    //require('child_process').execSync("node testvalues/insertTestValues.js");

    //Get token
    const requestToken = Object.assign({}, {
        method: 'POST',
        url: '/authenticate',
        payload: {
            name: "Joe Slowinski",
            password: "testpw"
        }
    });

    return server.inject(requestToken)
        .then(response => {
            token = response.result.token;
        });
});

test.before(t => {
    //Get terrarium id
    const requestTerr = Object.assign({}, {
        method: 'GET',
        url: '/terrariums',
        payload: {},
        headers: {
            authorization: token
        }
    });

    return server.inject(requestTerr)
        .then(response => {
            terrariumId = JSON.parse(response.payload).terrariums[0]._id;
        });

    //Get thingy id
});

test.before(t => {
    const requestThin = Object.assign({}, {
        method: 'GET',
        url: '/terrarium/'+terrariumId+'/thingies',
        payload: {},
        headers: {
            authorization: token
        }
    });

    return server.inject(requestThin)
        .then(response => {
            thingyId = JSON.parse(response.payload).thingies[0]._id;
        });
});

//apis that dont need authentication
test('Test if the home is working', t => {
    const request = Object.assign({}, {
        method: 'GET',
        url: '/',
        payload: {}
    });

    return server.inject(request)
        .then(response => {
            t.is(response.statusCode, 200, 'status code is 200 so the home is available');
        });
});


//api with authentication
test('Test /authentication', t => {
    const request = Object.assign({}, {
        method: 'POST',
        url: '/authenticate',
        payload: {
            name: "Joe Slowinski",
            password: "testpw"
        }
    });

    return server.inject(request)
        .then(response => {
            token = response.result.token;
            t.is(response.statusCode, 200) &&
            t.true(response.result.success);
        });
});

/**
 * ALL TERRARIUMS
 */
test('Test /terrariums', t => {
    const request = Object.assign({}, {
        method: 'GET',
        url: '/terrariums',
        payload: {},
        headers: {
            authorization: token
        }
    });

    let schema = Joi.object({
        _id: Joi.string(),
        terrariums: Joi.array().items(Joi.object({
                _id: Joi.string(),
                name: Joi.string()
            })
        )
    });

    return server.inject(request)
        .then(response => {
            let resp = JSON.parse(response.payload);
            Joi.validate(resp, schema, (err) => {
                if (err) {
                    return t.false(true, "Schema is not fitting the response");
                }

                t.is(response.statusCode, 200);
            });
        });
});


test('Test /terrariums/values', t => {
    const request = Object.assign({}, {
        method: 'GET',
        url: '/terrariums/values',
        payload: {},
        headers: {
            authorization: token
        }
    });

    let schema = Joi.array().items(Joi.object({
            "_id": Joi.string(),
            "name": Joi.string(),
            "thingies": Joi.array().items(schemas.thingyWithAll)
        })
    );

    return server.inject(request)
        .then(response => {
            let resp = JSON.parse(response.payload);
            let test = Joi.validate(resp, schema);

            if(test.error === null){
                t.is(response.statusCode, 200);
            } else {
                console.error(test);
                t.false(true, "Schema is not fitting the response:\n");
            }
        });
});

test('Test /terrariums/temperature', t => {
    const request = Object.assign({}, {
        method: 'GET',
        url: '/terrariums/temperature',
        payload: {},
        headers: {
            authorization: token
        }
    });

    let schema = Joi.array().items({
        "_id": Joi.string(),
        "name": Joi.string(),
        "thingies": Joi.array().items(schemas.thingyWithTemperatures)
    });

    return server.inject(request)
        .then(response => {
            let resp = JSON.parse(response.payload);
            let test = Joi.validate(resp, schema);

            if(test.error === null){
                t.is(response.statusCode, 200);
            } else {
                console.error(test);
                t.false(true, "Schema is not fitting the response:\n");
            }
        });
});

test('Test /terrariums/humidity', t => {
    const request = Object.assign({}, {
        method: 'GET',
        url: '/terrariums/humidity',
        payload: {},
        headers: {
            authorization: token
        }
    });

    let schema = Joi.array().items({
        "_id": Joi.string(),
        "name": Joi.string(),
        "thingies": Joi.array().items(schemas.thingyWithHumidities)
    });

    return server.inject(request)
        .then(response => {
            let resp = JSON.parse(response.payload);
            let test = Joi.validate(resp, schema);

            if(test.error === null){
                t.is(response.statusCode, 200);
            } else {
                console.error(test);
                t.false(true, "Schema is not fitting the response:\n");
            }
        });
});

test('Test /terrariums/airquality', t => {
    const request = Object.assign({}, {
        method: 'GET',
        url: '/terrariums/airquality',
        payload: {},
        headers: {
            authorization: token
        }
    });

    let schema = Joi.array().items({
        "_id": Joi.string(),
        "name": Joi.string(),
        "thingies": Joi.array().items(schemas.thingyWithAirQualities)
    });

    return server.inject(request)
        .then(response => {
            let resp = JSON.parse(response.payload);
            let test = Joi.validate(resp, schema);

            if(test.error === null){
                t.is(response.statusCode, 200);
            } else {
                console.error(test);
                t.false(true, "Schema is not fitting the response:\n");
            }
        });
});

/**
 * SPECIFIC TERRARIUMS
 */

test('Test /terrarium/{terrarium_id}/thingies', t => {
    const request = Object.assign({}, {
        method: 'GET',
        url: '/terrarium/'+terrariumId+'/thingies',
        payload: {},
        headers: {
            authorization: token
        }
    });

    let schema = Joi.object({
        "_id": Joi.string(),
        "name": Joi.string(),
        "thingies": Joi.array().items(schemas.thingy)
    });

    return server.inject(request)
        .then(response => {
            let resp = JSON.parse(response.payload);
            let test = Joi.validate(resp, schema);

            if(test.error === null){
                t.is(response.statusCode, 200);
            } else {
                console.error(test);
                t.false(true, "Schema is not fitting the response:\n");
            }
        });
});

test('Test /terrarium/{terrarium_id}/values', t => {
    const request = Object.assign({}, {
        method: 'GET',
        url: '/terrarium/'+terrariumId+'/values',
        payload: {},
        headers: {
            authorization: token
        }
    });

    let schema = Joi.object({
        "_id": Joi.string(),
        "name": Joi.string(),
        "thingies": Joi.array().items(schemas.thingyWithAll)
    });

    return server.inject(request)
        .then(response => {
            let resp = JSON.parse(response.payload);
            let test = Joi.validate(resp, schema);

            if(test.error === null){
                t.is(response.statusCode, 200);
            } else {
                console.error(test);
                t.false(true, "Schema is not fitting the response:\n");
            }
        });
});

test('Test /terrarium/{terrarium_id}/temperatures', t => {
    const request = Object.assign({}, {
        method: 'GET',
        url: '/terrarium/'+terrariumId+'/temperatures',
        payload: {},
        headers: {
            authorization: token
        }
    });

    let schema = Joi.object({
        "_id": Joi.string(),
        "name": Joi.string(),
        "thingies": Joi.array().items(schemas.thingyWithTemperatures)
    });

    return server.inject(request)
        .then(response => {
            let resp = JSON.parse(response.payload);
            let test = Joi.validate(resp, schema);

            if(test.error === null){
                t.is(response.statusCode, 200);
            } else {
                console.error(test);
                t.false(true, "Schema is not fitting the response:\n");
            }
        });
});

test('Test /terrarium/{terrarium_id}/humidities', t => {
    const request = Object.assign({}, {
        method: 'GET',
        url: '/terrarium/'+terrariumId+'/humidities',
        payload: {},
        headers: {
            authorization: token
        }
    });

    let schema = Joi.object({
        "_id": Joi.string(),
        "name": Joi.string(),
        "thingies": Joi.array().items(schemas.thingyWithHumidities)
    });

    return server.inject(request)
        .then(response => {
            let resp = JSON.parse(response.payload);
            let test = Joi.validate(resp, schema);

            if(test.error === null){
                t.is(response.statusCode, 200);
            } else {
                console.error(test);
                t.false(true, "Schema is not fitting the response:\n");
            }
        });
});

test('Test /terrarium/{terrarium_id}/airqualities', t => {
    const request = Object.assign({}, {
        method: 'GET',
        url: '/terrarium/'+terrariumId+'/airqualities',
        payload: {},
        headers: {
            authorization: token
        }
    });

    let schema = Joi.object({
        "_id": Joi.string(),
        "name": Joi.string(),
        "thingies": Joi.array().items(schemas.thingyWithAirQualities)
    });

    return server.inject(request)
        .then(response => {
            let resp = JSON.parse(response.payload);
            let test = Joi.validate(resp, schema);

            if(test.error === null){
                t.is(response.statusCode, 200);
            } else {
                console.error(test);
                t.false(true, "Schema is not fitting the response:\n");
            }
        });
});

/**
 * SPECIFIC THING IN A SPECIFIC TERRARIUM
 */

test('Test /terrarium/{terrarium_id}/thingies/{thingy_id}/values', t => {
    const request = Object.assign({}, {
        method: 'GET',
        url: '/terrarium/'+terrariumId+'/thingies/'+thingyId+'/values',
        payload: {},
        headers: {
            authorization: token
        }
    });

    let schema = schemas.thingyWithAll;

    return server.inject(request)
        .then(response => {
            let resp = JSON.parse(response.payload);
            let test = Joi.validate(resp, schema);

            if(test.error === null){
                t.is(response.statusCode, 200);
            } else {
                console.error(test);
                t.false(true, "Schema is not fitting the response:\n");
            }
        });
});

test('Test /terrarium/{terrarium_id}/thingies/{thingy_id}/temperature', t => {
    const request = Object.assign({}, {
        method: 'GET',
        url: '/terrarium/'+terrariumId+'/thingies/'+thingyId+'/temperature',
        payload: {},
        headers: {
            authorization: token
        }
    });

    let schema = schemas.thingyWithTemperatures;

    return server.inject(request)
        .then(response => {
            let resp = JSON.parse(response.payload);
            let test = Joi.validate(resp, schema);

            if(test.error === null){
                t.is(response.statusCode, 200);
            } else {
                console.error(test);
                t.false(true, "Schema is not fitting the response:\n");
            }
        });
});

test('Test /terrarium/{terrarium_id}/thingies/{thingy_id}/humidity', t => {
    const request = Object.assign({}, {
        method: 'GET',
        url: '/terrarium/'+terrariumId+'/thingies/'+thingyId+'/humidity',
        payload: {},
        headers: {
            authorization: token
        }
    });

    let schema = schemas.thingyWithHumidities;

    return server.inject(request)
        .then(response => {
            let resp = JSON.parse(response.payload);
            let test = Joi.validate(resp, schema);

            if(test.error === null){
                t.is(response.statusCode, 200);
            } else {
                console.error(test);
                t.false(true, "Schema is not fitting the response:\n");
            }
        });
});

test('Test /terrarium/{terrarium_id}/thingies/{thingy_id}/airquality', t => {
    const request = Object.assign({}, {
        method: 'GET',
        url: '/terrarium/'+terrariumId+'/thingies/'+thingyId+'/airquality',
        payload: {},
        headers: {
            authorization: token
        }
    });

    let schema = schemas.thingyWithAirQualities;

    return server.inject(request)
        .then(response => {
            let resp = JSON.parse(response.payload);
            let test = Joi.validate(resp, schema);

            if(test.error === null){
                t.is(response.statusCode, 200);
            } else {
                console.error(test);
                t.false(true, "Schema is not fitting the response:\n");
            }
        });
});

