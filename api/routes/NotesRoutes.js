const NotesController = require('../controllers/NotesController');
const passport = require('passport');

module.exports = function (app) {

    app.route('/notes')
        .get(passport.authenticate('jwt', { session: false }), NotesController.getAll)
        .post(passport.authenticate('jwt', { session: false }), NotesController.saveNote);

    app.route('/notes/:id')
        .get(passport.authenticate('jwt', { session: false }), NotesController.getById)
        .put(passport.authenticate('jwt', { session: false }), NotesController.updateNote)
        .delete(passport.authenticate('jwt', { session: false }), NotesController.deleteNote);
}