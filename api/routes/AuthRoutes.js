const AuthController = require('../controllers/AuthController');
const passport = require('passport');

module.exports = function (app) {

    app.route('/auth/register')
        .post(AuthController.register);

    app.route('/auth/login')
        .post(AuthController.login);

    app.route('/auth/logout')
        .post(passport.authenticate('jwt', {
            session: false
        }), AuthController.logout);

    app.route('/auth/verify/:id')
        .post(AuthController.verify);
};