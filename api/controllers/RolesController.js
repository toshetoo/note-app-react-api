const Role = require('mongoose').model('Role');

module.exports = {
    getAll: (req, res) => {
        Role.find({}, (error, notes) => {
            if (error)
                res.send(error);

            res.json(notes);
        });
    },

    getById: (req, res) => {
        const id = req.params.id;
        Role.findOne({
            _id: id
        }, (error, note) => {
            if (error)
                res.send(error);

            res.json(note[0]);
        });
    },

    saveRole: (req, res) => {
        let role = req.body;

        // override this props if the user set them
        role.canBeDeleted = true;
        role.canBeModified = true;

        Role.create(role).then(() => {
            res.sendStatus(200);
        });
    },

    updateRole: (req, res) => {
        const id = req.params.id;
        const role = req.body;

        Role.findById(id, (err, updatedRole) => {
            if(err)
                res.send(err);

            if(!role.canBeModified) 
                res.status(400).json({
                    message: `Role with id ${id} cannot be modified`
                });

            role.canBeDeleted = updatedRole.canBeDeleted;
            role.canBeModified = updatedRole.canBeModified;

            Role.update({_id: id}, role, (err, r) => {
                if(err)
                    res.send(err);

                res.sendStatus(200);
            });
        });
    },

    deleteRole: (req, res) => {
        const id = req.params.id;
        Role.findById(id, (err, updatedRole) => {
            if(err)
                res.send(err);

            if(!role.canBeDeleted) 
                res.status(400).json({
                    message: `Role with id ${id} cannot be deleted`
                });            

            Role.deleteOne({_id: id}, (err, r) => {
                if(err)
                    res.send(err);

                res.sendStatus(200);
            });
        });
    }
}

module.exports.config = {
    controllerName: 'RolesController',

    getAll: {
        displayName: "Get all roles",
        description: "Can see all roles",
    },

    getById: {
        displayName: "Get a single roles",
        description: "Get a single roles by its id",
        forUser: true
    },

    saveRole: {
        displayName: "Save roles",
        description: "Create a new roles",
    },

    updateRole: {
        displayName: "Update roles",
        description: "Update an existing roles",
    },

    deleteRole: {
        displayName: "Delete roles",
        description: "Can delete an existing roles",
    }
}