const moment = require('moment');
const Log = require('mongoose').model('Log');

module.exports = {
    log: (msg) => {
        let currentDateTime = moment().format('YYYY-MM-DD hh:mm:ss');
        let log = `[${currentDateTime}]: ${msg}`;

        // display it on the console
        console.log(log);


        const model = {
            msg: msg,
            timestamp: currentDateTime
        };
        //log in the db
        Log.create(model);
    }
}