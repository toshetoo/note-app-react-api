const User = require('../models/UsersModel');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const guid = require('uuid');

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = guid();
jwtOptions.ignoreExpiration = false;
jwtOptions.jsonWebTokenOptions = {
	expiresIn: '1d'
};

const strategy = new JwtStrategy(jwtOptions, (jwt_payload, next) => {
	User.findById(jwt_payload.id, (err, user) => {
		if (user) {
			next(null, jwt_payload);
		} else {
			next(null, false);
		}
	});
});

module.exports = {
	initializePassport: () => {
		passport.use(strategy);
	},
	jwtOptions: jwtOptions
};