const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let UserRolesSchema = new Schema({
    name: {
        type: String,
        required: 'Role name is required'
    },

    canBeModified: {
        type: Boolean,
        default: true
    },

    canBeDeleted: {
        type: Boolean,
        default: true
    },

    permissions: {
        type: [Schema.Types.ObjectId],
        default: []
    }
});

module.exports = mongoose.model('Role', UserRolesSchema);