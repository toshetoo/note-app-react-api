const RolesController = require('../controllers/RolesController');
const passport = require('passport');
const acl = require('../config/acl');

const controllerName = "RolesController";

module.exports = function (app) {

    app.route('/roles')
        .get(passport.authenticate('jwt', {
            session: false
        }), acl.canAccess('getAll', controllerName), RolesController.getAll)
        .post(passport.authenticate('jwt', {
            session: false
        }), acl.canAccess('saveRole', controllerName), RolesController.saveNote);

    app.route('/roles/:id')
        .get(passport.authenticate('jwt', {
            session: false
        }), acl.canAccess('getById', controllerName), RolesController.getById)
        .put(passport.authenticate('jwt', {
            session: false
        }), acl.canAccess('updateRole', controllerName), RolesController.updateNote)
        .delete(passport.authenticate('jwt', {
            session: false
        }), acl.canAccess('deleteRole', controllerName), RolesController.deleteNote);
}