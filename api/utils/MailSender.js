const mailer = require('nodemailer');
const Logger = require('./Logger');

const transporter = mailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'testforhallmanager@gmail.com',
        pass: 'hallmanager'
    },
    tls: {
        rejectUnauthorized: false
    }
});

module.exports = {
    sendRegistrationMail: (user, successCallback, errorCallback) => {
        const mailOptions = {
            from: 'no-reply@note-manager.com',
            to: user.email,
            subject: 'Registration completed!',
            text: `
                In order to verify your email, click on the following link: https://personal-notes-api.herokuapp.com/auth/verify/${user.id}
            `
        };

        //TODO remove this log
        Logger.log(mailOptions.text);

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                Logger.log(error);

                errorCallback && errorCallback(error);
            } else {
                Logger.log('Email sent: ' + info.response);

                successCallback && successCallback(info);
            }
        });
    }
}