const mongoose = require('mongoose');
const Note = mongoose.model('Note');
const guid = require('uuid');

module.exports =  {
    getAll: (req, res) => {
        Note.find({}, (error, notes) => {
            if(error)
                res.send(error);

            res.json(notes);
        });
    },

    getById: (req, res) => {
        const id = req.params.id;
        Note.findOne({ _id: id }, (error, note) => {
            if(error)
                res.send(error);

            res.json(note[0]);
        });
    }, 

    saveNote: (req, res) => {
        let note = req.body;
        Note.create(note).then(() => {
            res.sendStatus(200);
        });
    },

    updateNote: (req, res) => {
        const id = req.params.id;
        const note = req.body;
        Note.update({_id: id}, note, (err, updatedNote) => {
            if(err)
                res.send(err);

            res.sendStatus(200);
        });
    },

    deleteNote: (req, res) => {
        const id = req.params.id;
        Note.deleteOne({_id: id}, (err, deleted) => {
            if(err)
                res.send(err);

            res.sendStatus(200);
        });
    }
};