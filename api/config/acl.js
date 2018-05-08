const Role = require('../models/UserRolesModel');
const Permission = require('../models/UserPermissionModel');
const User = require('../models/UsersModel');
const controllers = require('../controllers/exporter');
const MailSender = require('../utils/MailSender');

const seedPermissions = () => {
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
                        console.log(`Permission ${perm.name} created for controller ${perm.controller} with id ${p.id}`);
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
                            console.log(`Permission ${perm.name} deleted as it is no longer used.`);
                        });
                    }
                }
            }
        });
    });
};

const seedRoles = () => {
    // first check if user and admin roles exist
    Role.findOne({
        name: 'Admin'
    }, (err, role) => {
        Permission.find({}, (err, allPermissions) => {

            if (role) {
                role.permissions = allPermissions.map(p => p.id);
                Role.update({
                    _id: role.id
                }, (err, updatedRole) => {
                    console.log('Admin role updated');
                });
            } else {
                const adminRole = {
                    name: 'Admin',
                    canBeDeleted: false,
                    canBeModified: false,
                    permissions: allPermissions.map(p => p.id)
                };

                Role.create(adminRole).then(() => {
                    console.log('Admin role created');
                });
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
                }, (err, updated) => {
                    console.log('User role updated');
                });
            } else {
                const userRole = {
                    name: 'User',
                    canBeDeleted: false,
                    canBeModified: true,
                    permissions: perms.map(p => p.id)
                }

                Role.create(userRole).then(() => {
                    console.log('User role created');
                });
            }
        });
    });

};

const seedAdmin = () => {
    // check if admin user exists
    User.findOne({
        email: 'admin@admin.com'
    }, (err, user) => {
        if (!user) {
            Role.findOne({
                name: 'Admin'
            }, (err, role) => {
                const adminUser = {
                    firstName: 'Admin',
                    lastName: 'Admin',
                    email: 'admin@admin.com',
                    roles: role.id
                };

                User.create(adminUser).then((savedAdmin) => {
                    MailSender.sendRegistrationMail(savedAdmin);
                    console.log('Admin seeded');
                });
            });
        }
    });
};

module.exports = {
    initialize: () => {
        seedPermissions();
        seedRoles();
        seedAdmin();
    },

    canAccess: (req, role) => {

    }
}