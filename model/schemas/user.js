const Mongoose = require('mongoose');
const Argon2 = require('argon2');

var userSchema = Mongoose.Schema({
    name: {
        type: String,
        require: true
    },

    mailAddress: {
        type: String,
        require: true
    },

    password: {
        type: String,
        require: true
    },
    comment: String,

    terrariums: [require('./terrarium')],
    profiles: [require('./targetConfiguration')]
});

userSchema.pre('save', function (next)
{
    var user = this;
    if (this.isModified('password') || this.isNew)
    {
        Argon2.hash(user.password, {type: Argon2.argon2i})
        .then(hash =>
        {
            user.password = hash;
            next();
        })
        .catch(err =>
        {
            return next(err);
        });
    }
    else
    {
        return next();
    }
});

userSchema.methods.verifyPassword = function (passw, callback)
{
    Argon2.verify(this.password, passw)
    .then(match =>
    {
        callback(match);
    })
    .catch(err =>
    {
        // Internal failure
        throw err;
    });
};

module.exports = userSchema;
