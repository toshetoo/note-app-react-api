const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = {
    getAll: (req, res) => {
        User.find({}, (error, users) => {
            if (error)
                res.send(error);

            res.json(users);
        });
    },

    getByProp: (req, res) => {
        const prop = Object.keys(req.params);
        const value = req.params[prop];
        User.findOne({ prop: value }, (error, user) => {
            if (error)
                res.send(error);

            res.json(user);
        });
    },

    saveUser: (req, res) => {
        let user = req.body;
        User.create(user).then(() => {
            res.sendStatus(200);
        });
    },

    updateUser: (req, res) => {
        const id = req.params.id;
        const user = req.body;
        User.update({ _id: id }, user, (err, updatedUser) => {
            if (err)
                res.send(err);

            res.sendStatus(200);
        });
    },

    deleteUser: (req, res) => {
        const id = req.params.id;
        User.deleteOne({ _id: id }, (err, deleted) => {
            if (err)
                res.send(err);

            res.sendStatus(200);
        });
    },

    uploadImage: (req, res) => {
        const userId = req.params.id;

        if (!req.files)
            return res.status(400).send('No files were uploaded.');

        User.findById(userId, (err, user) => {
            if (err)
                return res.status(400);

            const userFile = req.files.userImage;

            userFile.mv('../data/images', (err) => {
                if (err)
                    return res.status(500).send(err);

                user.image = {
                    title: userFile.name,
                    url: `../data/images/${userFile.name}`
                }

                User.update({ _id: id }, user, (err, updatedUser) => {
                    if (err)
                        res.send(err);

                    res.sendStatus(200);
                });
            });
        });
    },
};