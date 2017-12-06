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
/*const {child} = require('child_process');

test.before(
    child.execSync("node ../testvalues/insertTestValues.js")
);*/

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
test('Test if Joe has two terrariums', t => {
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

