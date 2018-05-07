const AuthController = require('../controllers/AuthController');
const passport = require('passport');

module.exports = function (app) {

    app.route('/auth/register')
        .post(AuthController.register);

    app.route('/auth/login')
        .post(AuthController.login);

    app.route(passport.authenticate('jwt', { session: false }), '/auth/logout')
        .post(AuthController.logout);

    app.route('/auth/verify/:id')
        .get(AuthController.verify);

    app.route(passport.authenticate('jwt', { session: false }), '/auth/acl/assignRole')
        .post(AuthController.assignRole);

    app.route(passport.authenticate('jwt', { session: false }), '/auth/acl/revokeRole')
        .post(AuthController.revokeRole);
}