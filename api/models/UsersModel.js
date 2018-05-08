const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let UserSchema = new Schema({
    firstName: {
        type: String,
        required: 'First name is required.'
    },
    lastName: {
        type: String,
        required: 'Last name is required.'
    },
    email: {
        type: String,
        required: "Email is required"
    },
    password: {
        salt: {
            type: String
        },
        hashedPassword: {
            type: String
        }
    },
    verified: {
        type: Boolean,
        default: false
    },
    image: {
        title: {
            type: String,
            default: null
        },
        url: {
            type: String,
        }
    },
    roles: {
        type: [Schema.Types.ObjectId],
        default: []
    }
});

UserSchema.method({
    authenticate: (password) => {
        return encryption.generateHashedPassword(this.password.salt, password) === this.password.hashedPassword;
    }
});

module.exports = mongoose.model('User', UserSchema);