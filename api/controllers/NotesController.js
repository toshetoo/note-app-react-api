const mongoose = require('mongoose');
const Note = mongoose.model('Note');
const guid = require('uuid');

module.exports = {
    getAll: (req, res) => {
        Note.find({}, (error, notes) => {
            if (error)
                res.send(error);

            res.json(notes);
        });
    },

    getById: (req, res) => {
        const id = req.params.id;
        Note.findOne({
            _id: id
        }, (error, note) => {
            if (error)
                res.send(error);

            res.json(note);
        });
    },

    getByAuthorId: (req, res) => {
        const id = req.params.id;
        Note.find({authorId: id}, (err, notes) => {
            if(err)
                res.send(err);

            res.json(notes);
        });
    },

    saveNote: (req, res) => {
        let note = req.body;
        note.authorId = req.user.id;
        Note.create(note).then(() => {
            res.sendStatus(200);
        });
    },

    updateNote: (req, res) => {
        const id = req.params.id;
        const note = req.body;
        Note.update({
            _id: id
        }, note, (err, updatedNote) => {
            if (err)
                res.send(err);

            res.sendStatus(200);
        });
    },

    deleteNote: (req, res) => {
        const id = req.params.id;
        Note.deleteOne({
            _id: id
        }, (err, deleted) => {
            if (err)
                res.send(err);

            res.sendStatus(200);
        });
    }
};

module.exports.config = {
    controllerName: 'NotesController',

    getAll: {
        displayName: "Get all notes",
        description: "Can see all notes",
    },

    getById: {
        displayName: "Get a single note",
        description: "Get a single note by its id",
        forUser: true
    },

    getByAuthorId: {
        displayName: "Get note by author",
        description: "Get a all notes for a user",
        forUser: true
    },

    saveNote: {
        displayName: "Save note",
        description: "Create a new note",
        forUser: true
    },

    updateNote: {
        displayName: "Update note",
        description: "Update an existing note",
        forUser: true
    },

    deleteNote: {
        displayName: "Delete note",
        description: "Can delete an existing note",
        forUser: true
    }
}