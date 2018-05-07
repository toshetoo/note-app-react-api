const express = require("express");
const mongoose = require( 'mongoose');
const NotesModel = require( './api/models/NotesModel');
const UsersModel = require( './api/models/UsersModel');
const UserRoleModel = require('./api/models/UserRolesModel');
const bodyParser = require( 'body-parser');
const notesRoutes = require( './api/routes/NotesRoutes');
const userRoutes = require( './api/routes/UserRoutes');
const authRoutes = require( './api/routes/AuthRoutes');
const passportConfig = require('./api/config/passport');
const passport = require('passport');
const fileUpload = require('express-fileupload');
const acl = require('./api/config/acl');

app = express();
port = process.env.PORT || 3000;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/NotesDB'); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(fileUpload({
	limits: { fileSize: 50 * 1024 * 1024 },
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
console.log('Server started on port ' + port);