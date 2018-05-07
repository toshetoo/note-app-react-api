const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let UserRolesSchema = new Schema({
    name: {
        type: String,
        required: 'Role name is required'
    },
    permissions: {
        type: [Schema.Types.ObjectId],
        default: []
    }
});

module.exports = mongoose.model('Role', UserRolesSchema);