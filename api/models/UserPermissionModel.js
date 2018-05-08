const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let UserPermissionSchema = new Schema({
    name: {
        type: String,
        required: 'Permission name is required'
    },
    displayName: {
        type: String,
        required: 'Display name is required'
    },
    controller: {
        type: String,
        required: 'Controller name is required'
    },
    forUser: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Permission', UserPermissionSchema);