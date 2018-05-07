const User = require('../models/UsersModel');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const guid = require('uuid');

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = guid();
jwtOptions.passReqToCallback = true;

const strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
	User.findById(jwt_payload.id, (user) => {
		if (user) {
			next(null, user);
		} else {
			next(null, false);
		}
	});
});

module.exports = {
	initializePassport : () => {
		passport.use(strategy);
	},
	jwtOptions : jwtOptions
};