const mongoose = require('mongoose');
const User = mongoose.model('User');
const Role = mongoose.model('Role');
const Permission = mongoose.model('Permission');
const encryption = require('../utils/encryption');
const MailSender = require('../utils/MailSender');
const jwt = require('jsonwebtoken');
const auth = require('../config/passport');

module.exports = {
    register: (req, res) => {
        const userData = req.body;

        //check if this email exists
        User.findOne({
            email: userData.email
        }, (err, user) => {
            if (err || user) {
                res.sendStatus(400);
                return;
            }

            // hash the password
            if (userData.password) {
                let salt = encryption.generateSalt();
                userData.password = {
                    salt: salt,
                    hashedPassword: encryption.generateHashedPassword(salt, userData.password)
                };
            }

            // even if the user passes the verified flag, override it to false
            userData.verified = false;

            //try to create the user
            User.create(userData).then((user) => {
                // send verification mail
                MailSender.sendRegistrationMail(user);

                res.sendStatus(200);
            }, (err) => {
                res.send(err);
            });
        });
    },

    verify: (req, res) => {
        const id = req.params.id;

        User.findById(id, (err, user) => {
            if (err) {
                res.send(err);
            }

            // don't verify again
            if (user.verified) {
                res.sendStatus(400);
                return;
            }

            user.verified = true;

            User.update({
                _id: id
            }, user, (err, verifiedUser) => {
                res.sendStatus(200);
            });
        });
    },

    login: (req, res) => {
        const credentials = req.body;

        User.findOne({
            email: credentials.email
        }, (err, user) => {
            if (err) {
                res.send(err);
            }

            if (!user.verified) {
                res.sendStatus(400);
                return;
            }

            if (!user.authenticate(credentials.password)) {
                res.sendStatus(400);
                return;
            }

            //get user permissions
            user.extractPermissions().then((perms) => {
                const payload = {
                    id: user.id,
                    email: user.email,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    roles: user.roles,
                    permissions: perms
                };
                const token = jwt.sign(payload, auth.jwtOptions.secretOrKey);

                res.json({
                    message: 'ok',
                    token: token
                });
            });
        });
    },

    logout: (req, res) => {

    }
};