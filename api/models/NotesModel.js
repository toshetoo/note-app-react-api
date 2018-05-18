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
    },
    authorId: {
        type: Schema.Types.ObjectId,
        required: 'Author required'
    }
});

module.exports = mongoose.model('Note', NoteSchema);