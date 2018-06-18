var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");
const SALT_FACTOR = 10;


//defining a schema
var userSchema = mongoose.Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
	displayName: String,
	bio: String
});


var noop = function() {}; //a do nthing fntn to use with bcrypt module

userSchema.pre("save", function(done) {
	var user = this;
	if (!user.isModified("password")) {
		return done();
	}
	bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
		if (err) {
			return done(err);
		}
		bcrypt.hash(user.password, salt, noop, function(err, hashedPassword) {
			if (err) {
				return done(err);
			}
			user.password = hashedPassword;
			done();
		});
	});
});

userSchema.methods.checkPassword = function(guess, done) {
	bcrypt.compare(guess, this.password, function(err, isMatch) {
		done(err, isMatch);
	});
};

userSchema.methods.name = function() {
	return this.displayName || this.username;
};

var User = mongoose.model("User", userSchema);//attaching the schema to an actual model("user")
module.exports = User;
