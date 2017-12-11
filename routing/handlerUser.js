const Mongoose = require('mongoose');

let User = Mongoose.model('User');

module.exports = {

    getUser: function (request, reply) {
        User.findOne({name: request.auth.credentials.userName})
            .select('name mailAddress')
            .exec(function (err, user) {
                if (err) {
                    console.error(err);
                    return reply({"Error": "Database problem. Please try again later"}).code(500);
                }

                if(!user){
                    return reply({"Error": "User not found"}).code(404);
                }

                reply(user).code(200);
            });
    },

    updateUser: function (request, reply) {
        let email = request.payload.mailAddress;
        let pw = request.payload.password;
        let changes = {};

        User.findOne({name: request.auth.credentials.userName})
            .select('name mailAddress password')
            .exec(function (err, user) {
                if (err) {
                    console.error(err);
                    return reply({"Error": "Database problem. Please try again later"}).code(500);
                }

                if(!user){
                    return reply({"Error": "User not found"}).code(404);
                }

                if(email){
                    user.mailAddress = email;
                    changes.email = email;
                }
                if(pw){
                    user.password = pw;
                    changes.password = "Psssssst!";
                }

                user.save((err)=>{
                    if(err){
                        return reply({"Error": "Database problem. Please try again later"}).code(500);
                    }
                });

                reply({"success": true, "message": "User update complete!", "values": changes}).code(200);
            });
    }
};