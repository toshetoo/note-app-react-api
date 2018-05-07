const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let NoteSchema = new Schema({
    title: {
        type: String,
        required: 'Please, input name'
    },    
    description: {
        type: String,
        required: 'Please, input description'
    },
    creationDate: {
        type: Date, 
        default: Date.now
    },
    lastEdit: {
        type: Date, 
        default: null
    }
});

module.exports = mongoose.model('Note', NoteSchema);