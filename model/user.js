/**
 * Created by Tanja on 26/10/17.
 */

const Mongoose = require('mongoose');

var userSchema = Mongoose.Schema(
{
	name :
	{
		type : String,
		require : true
	},
	mailAddress :
	{
		type : String,
		require : true
	},
	password : String, // TODO: Not known yet how to do that
	comment : String,

	terrariums : [
	{
		type : Mongoose.Schema.Types.ObjectId,
		ref : 'Terrarium'
	}]
});

module.exports = Mongoose.model("User", userSchema);
