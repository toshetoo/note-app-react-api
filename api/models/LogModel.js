const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let LogSchema = new Schema({
    msg: {
        type: String,
        required: true
    }, 
    timestamp: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Log', LogSchema);