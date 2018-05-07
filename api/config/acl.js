const Role = require('../models/UserRolesModel');

module.exports = {
    initialize: () => {
        Role.findOne({ title: 'Admin' }, (err, role) => {
            if (err || !role) {
                const adminRole = {
                    title: 'Admin'
                };

                Role.create(adminRole).then(() => {
                    console.log('Admin role seeded');
                });
            }
        });

        Role.findOne({ title: 'User' }, (err, role) => {
            if (err || !role) {
                const userRole = {
                    title: 'User'
                };

                Role.create(userRole).then(() => {
                    console.log('User role seeded');
                });
            }
        });
    },

    canAccess: (req, role) => {
        
    }
}