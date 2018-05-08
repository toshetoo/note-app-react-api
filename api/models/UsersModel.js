const mongoose = require('mongoose');
const encryption = require('../utils/encryption');
const Role = mongoose.model('Role');
const Permission = mongoose.model('Permission');

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
    authenticate: function (password) {
        return encryption.generateHashedPassword(this.password.salt, password) === this.password.hashedPassword;
    },
    extractRoles: function () {
        return new Promise((resolve, reject) => {
            const allRoles = [];
            const promises = [];
            for (roleId of this.roles) {
                promises.push(Role.findById(roleId, (err, role) => {
                    allRoles.push(role);
                }));
            }

            Promise.all(promises).then(() => {
                resolve(allRoles);
            });
        });
    },
    extractPermissions: function () {
        return new Promise((resolve, reject) => {
            this.extractRoles().then((roles) => {
                const promises = [];
                let allPermissions = [];
                this.extractRoles().then(() => {
                    const permIds = roles.map(role => role.permissions).reduce((acc, val) => acc.concat(val), []);
                    for (permId of permIds) {
                        promises.push(Permission.findById(permId, (err, permission) => {
                            allPermissions.push(permission);
                        }));
                    }

                    Promise.all(promises).then(() => {
                        // as this will be stored in the jwt token, reduce the size
                        allPermissions = allPermissions.map(p => {
                            return {
                                name: p.name,
                                controller: p.controller
                            }
                        });
                        resolve(allPermissions);
                    });
                });
            });
        });
    }
});

module.exports = mongoose.model('User', UserSchema);