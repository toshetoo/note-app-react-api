const Role = require('../models/UserRolesModel');
const Permission = require('../models/UserPermissionModel');
const User = require('../models/UsersModel');
const controllers = require('../controllers/exporter');
const MailSender = require('../utils/MailSender');
const Logger = require('../utils/Logger');

const encryption = require('../utils/encryption');

const seedPermissions = () => {
    Logger.log('Permission seed started.');
    return new Promise((resolve, reject) => {
        // first check if any permissions have been already seeded
        Permission.find({}, (error, allPermissions) => {
            const promises = [];
            const allDbPermissions = allPermissions || [];
            const currentlyGeneratedPermissions = [];

            for (const controller of controllers) {
                // go around all controllers to extract their endpoints and map them with their name
                const endpoints = Object.keys(controller).filter(e => e !== 'config').map(e => {
                    return {
                        name: e,
                        controller: controller.config.controllerName
                    }
                });

                for (const endpoint of endpoints) {
                    // check if the current permission exists in the database
                    const permissionExists = allDbPermissions.find(p => p.name === endpoint.name && p.controller === endpoint.controller);

                    // if not, seed it
                    if (!permissionExists) {
                        const perm = {
                            controller: endpoint.controller,
                            name: endpoint.name,
                            displayName: controller.config[endpoint.name].displayName,
                            forUser: controller.config[endpoint.name].forUser
                        };

                        promises.push(Permission.create(perm).then((p) => {
                            Logger.log(`Permission ${perm.name} created for controller ${perm.controller} with id ${p.id}`);
                            currentlyGeneratedPermissions.push(p);
                        }));
                    } else {
                        currentlyGeneratedPermissions.push(permissionExists);
                    }
                }
            }

            // be sure that all permissions are saved
            Promise.all(promises).then(() => {
                // if the current ones are fewer than the saved in the db, we need to delete old unused perms
                if (currentlyGeneratedPermissions.length < allDbPermissions.length) {
                    for (const perm of allDbPermissions) {
                        const isFound = currentlyGeneratedPermissions.find(p => p.id === perm.id);

                        if (!isFound) {
                            Permission.deleteOne({
                                _id: perm.id
                            }, () => {
                                Logger.log(`Permission ${perm.name} deleted as it is no longer used.`);
                            });
                        }
                    }
                }
                Logger.log('Permissions seed ended.');
                resolve();
            });
        });
    });
};

const seedRoles = () => {
    Logger.log('Roles seed started');
    return new Promise((resolve, reject) => {
        // first check if user and admin roles exist
        const promises = [];

        Role.findOne({
            name: 'Admin'
        }, (err, role) => {
            Permission.find({}, (err, allPermissions) => {

                if (role) {
                    role.permissions = allPermissions.map(p => p.id);
                    Role.update({
                        _id: role.id
                    }, role, (err, updatedRole) => {
                        Logger.log('Admin role updated');
                    });
                } else {
                    const adminRole = {
                        name: 'Admin',
                        canBeDeleted: false,
                        canBeModified: false,
                        permissions: allPermissions.map(p => p.id),
                    };

                    promises.push(Role.create(adminRole).then(() => {
                        Logger.log('Admin role created');
                    }));
                }
            });
        });

        Role.findOne({
            name: 'User'
        }, (err, role) => {
            Permission.find({
                forUser: true
            }, (err, perms) => {
                if (role) {
                    role.permissions = perms.map(p => p.id);

                    Role.update({
                        _id: role.id
                    }, role, (err, updated) => {
                        Logger.log('User role updated');
                    });
                } else {
                    const userRole = {
                        name: 'User',
                        canBeDeleted: false,
                        canBeModified: true,
                        permissions: perms.map(p => p.id)
                    }

                    promises.push(Role.create(userRole).then(() => {
                        Logger.log('User role created');
                    }));
                }
            });
        });

        Promise.all(promises).then(() => {
            Logger.log('Roles seed ended');
            resolve();
        })
    });
};

const seedAdmin = () => {
    return new Promise((resolve, reject) => {
        // check if admin user exists
    User.findOne({
        email: 'admin@admin.com'
    }, (err, user) => {
        if (!user) {
            Role.findOne({
                name: 'Admin'
            }, (err, role) => {
                let salt = encryption.generateSalt();
                const adminUser = {
                    firstName: 'Admin',
                    lastName: 'Admin',
                    email: 'admin@admin.com',
                    roles: role.id,
                    password: {
                        salt: salt,
                        hashedPassword: encryption.generateHashedPassword(salt, 'mypass')
                    }
                };

                User.create(adminUser).then((savedAdmin) => {
                    MailSender.sendRegistrationMail(savedAdmin);
                    Logger.log('Admin seeded');
                    resolve();
                });
            });
        } else {
            resolve();
        }
    });
    })
};

module.exports = {
    initialize: () => {
        return new Promise((resolve, reject) => {
            seedPermissions().then(() => {
                setTimeout(() => {
                    seedRoles().then(() => {
                        setTimeout(() => {
                            seedAdmin().then(() => {
                                resolve();
                            });
                        }, 100);
                    });
                }, 100);
            });
        });
    },

    canAccess: (permission, controller) => {
        return (req, res, next) => {
            const permissions = req.user.permissions;

            const hasPermission = permissions.find(p => p.name === permission && p.controller === controller);

            if (hasPermission) {
                next();
            } else {
                res.sendStatus(400);
                return;
            }
        }
    }
}