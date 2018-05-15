const mongoose = require('mongoose');
const User = mongoose.model('User');
const Role = mongoose.model('Role');
const Permission = mongoose.model('Permission');
const encryption = require('../utils/encryption');
const MailSender = require('../utils/MailSender');
const jwt = require('jsonwebtoken');
const auth = require('../config/passport');
const guid = require('uuid');

module.exports = {
    register: (req, res) => {
        const userData = req.body;

        //check if this email exists
        User.findOne({
            email: userData.email
        }, (err, user) => {
            if (err || user) {
                res.status(400).json({
                    error: err,
                    message: 'Email already exists'
                });
                return;
            }

            // hash a default password
            if (userData.password) {
                let salt = encryption.generateSalt();
                userData.password = {
                    salt: salt,
                    hashedPassword: encryption.generateHashedPassword(salt, guid())
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
        const data = req.body;

        User.findById(id, (err, user) => {
            if (err) {
                res.send(err);
            }

            user.verified = true;

            // hash the real password
            if (data.password) {
                let salt = encryption.generateSalt();
                user.password = {
                    salt: salt,
                    hashedPassword: encryption.generateHashedPassword(salt, data.password)
                };
            } else {
                res.status(400).json({
                    message: 'Password is missing.'
                });
            }

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
                res.status(400).json({
                    message: 'Account is not verified.'
                });
                return;
            }

            if (!user.authenticate(credentials.password)) {
                res.status(400).json({
                    message: 'Wrong username or password'
                });
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

    },

    forgotternPassword: (req, res) => {
        const userData = req.body;

        if (!userData || !userData.email) {
            res.status(400).json({
                message: 'Email is required.'
            });
            return;
        }

        User.findOne({
            email: userData.email
        }, (err, user) => {
            if (err) {
                res.send(err);
            }

            if (!user) {
                res.status(400).json({
                    message: 'No use exist witht this email address'
                });
                return;
            }

            // reset the password of the user
            let salt = encryption.generateSalt();
            user.password = {
                salt: salt,
                hashedPassword: encryption.generateHashedPassword(salt, guid())
            };

            MailSender.sendResetPasswordMail(user);
            res.sendStatus(200);
        })
    }
};