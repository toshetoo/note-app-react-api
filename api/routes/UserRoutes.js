const UsersController = require('../controllers/UsersController');
const passport = require('passport');

module.exports = function (app) {

    app.route('/users')
        .get(passport.authenticate('jwt', {
            session: false
        }), UsersController.getAll);

    app.route('/users/:id')
        .get(passport.authenticate('jwt', {
            session: false
        }), UsersController.getByProp)
        .put(passport.authenticate('jwt', {
            session: false
        }), UsersController.updateUser)
        .delete(passport.authenticate('jwt', {
            session: false
        }), UsersController.deleteUser);

    app.route('/users/acl/assignRole')
        .post(passport.authenticate('jwt', {
            session: false
        }), UsersController.assignRole);

    app.route('/users/acl/revokeRole')
        .post(passport.authenticate('jwt', {
            session: false
        }), UsersController.revokeRole);
}