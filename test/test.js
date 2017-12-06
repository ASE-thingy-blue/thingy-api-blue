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

let token;

//inject test data to the database
//and makes the token available as class variable
test.before(t => {
    //require('child_process').execSync("node testvalues/insertTestValues.js");

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
test('Test authentication', t => {
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

