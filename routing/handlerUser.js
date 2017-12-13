const Mongoose = require("mongoose");

let User = Mongoose.model("User");

module.exports = {

    getUser: function (request, reply) {
        User.findOne({name: request.auth.credentials.userName})
            .select("name mailAddress")
            .exec(function (err, user) {
                if (err) {
                    console.error(err);
                    return reply({"Error": "Database problem. Please try again later"}).code(500);
                }

                if (!user) {
                    return reply({"Error": "User not found"}).code(404);
                }

                reply(user).code(200);
            });
    },

    updateUser: function (request, reply) {
        let email = request.payload.mailAddress;
        let pw = request.payload.password;
        let pw2 = request.payload.repassword;

        User.findOne({name: request.auth.credentials.userName})
            .select("name mailAddress password")
            .exec(function (err, user) {
                if (err) {
                    console.error(err);
                    return reply({"success": false, "message": "Database problem. Please try again later"}).code(500);
                }

                if (!user) {
                    return reply({"success": false, "message": "User not found"}).code(404);
                }

                if (email) {
                    user.mailAddress = email;
                }
                if (pw) {
                    if (pw !== pw2) {
                        return reply({"success": false, "message": "Repeated passwort does not match."}).code(400);
                    }
                    user.password = pw;
                }

                user.save((err) => {
                    if (err) {
                        return reply({"success": false, "message": "Database problem. Please try again later"}).code(500);
                    }
                });

                reply({"success": true, "message": "User update complete!"}).code(200);
            });
    }
};
