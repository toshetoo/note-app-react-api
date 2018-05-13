const express = require("express");
const mongoose = require('mongoose');

const Log = require('./api/models/LogModel');
const NotesModel = require('./api/models/NotesModel');
const UserRoleModel = require('./api/models/UserRolesModel');
const Permission = require('./api/models/UserPermissionModel');
const UsersModel = require('./api/models/UsersModel');

const bodyParser = require('body-parser');

const notesRoutes = require('./api/routes/NotesRoutes');
const userRoutes = require('./api/routes/UserRoutes');
const authRoutes = require('./api/routes/AuthRoutes');
const rolesRoutes = require('./api/routes/RolesRoutes');

const passportConfig = require('./api/config/passport');
const passport = require('passport');
const fileUpload = require('express-fileupload');
const acl = require('./api/config/acl');

const Logger = require('./api/utils/Logger');

app = express();
port = process.env.PORT || 3000;
dbString = process.env.MONGODB_URI;

mongoose.Promise = global.Promise;
mongoose.connect(dbString);

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(fileUpload({
	limits: {
		fileSize: 50 * 1024 * 1024
	},
}));

notesRoutes(app);
userRoutes(app);
authRoutes(app);

passportConfig.initializePassport();

app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	next();
});

acl.initialize();

app.listen(port);
Logger.log('Server started on port ' + port);