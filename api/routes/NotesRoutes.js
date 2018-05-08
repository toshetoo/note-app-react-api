const NotesController = require('../controllers/NotesController');
const passport = require('passport');
const acl = require('../config/acl');

const controllerName = "NotesController";

module.exports = function (app) {

    app.route('/notes')
        .get(passport.authenticate('jwt', {
            session: false
        }), acl.canAccess('getAll', controllerName), NotesController.getAll)
        .post(passport.authenticate('jwt', {
            session: false
        }), acl.canAccess('saveNote', controllerName), NotesController.saveNote);

    app.route('/notes/:id')
        .get(passport.authenticate('jwt', {
            session: false
        }), acl.canAccess('getById', controllerName), NotesController.getById)
        .put(passport.authenticate('jwt', {
            session: false
        }), acl.canAccess('updateNote', controllerName), NotesController.updateNote)
        .delete(passport.authenticate('jwt', {
            session: false
        }), acl.canAccess('deleteNote', controllerName), NotesController.deleteNote);
}