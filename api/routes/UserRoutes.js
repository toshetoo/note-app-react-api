const UsersController = require('../controllers/UsersController');
const passport = require('passport');
const acl = require('../config/acl');

const controllerName = "UsersController";

module.exports = function (app) {

    app.route('/users')
        .get(passport.authenticate('jwt', {
            session: false
        }), acl.canAccess('getAll', controllerName), UsersController.getAll)
        .post(passport.authenticate('jwt', {
            session: false
        }), acl.canAccess('saveUser', controllerName), UsersController.saveUser);

    app.route('/users/getByProp')
        .get(passport.authenticate('jwt', {
            session: false
        }), acl.canAccess('getByProp', controllerName), UsersController.getByProp)

    app.route('/users/:id')
        .put(passport.authenticate('jwt', {
            session: false
        }), acl.canAccess('updateUser', controllerName), UsersController.updateUser)
        .delete(passport.authenticate('jwt', {
            session: false
        }), acl.canAccess('deleteUser', controllerName), UsersController.deleteUser);

    app.route('/users/uploadImage')
        .post(passport.authenticate('jwt', {
            session: false
        }), acl.canAccess('uploadImage', controllerName), UsersController.uploadImage);

    app.route('/users/acl/assignRole')
        .post(passport.authenticate('jwt', {
            session: false
        }), acl.canAccess('assignRole', controllerName), UsersController.assignRole);

    app.route('/users/acl/revokeRole')
        .post(passport.authenticate('jwt', {
            session: false
        }), acl.canAccess('revokeRole', controllerName), UsersController.revokeRole);
}