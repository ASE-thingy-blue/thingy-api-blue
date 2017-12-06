const Argon2 = require("argon2");
const Fs = require('fs');
const Path = require('path');
const Async = require('async');

// Returns a promise.
// Users of that module would have to use it as:
/*
require('./session').then(value =>
{
  // Use value here
});
*/
module.exports = Argon2.hash(Fs.readFileSync(Path.join('certs', 'ThingyAPI.epk')), {type: Argon2.argon2i}).then(hash =>
{
    return hash;
}).catch(err =>
{
    // Internal failure
    console.error(err);
})
