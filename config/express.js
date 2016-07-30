var express = require('express');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var validator = require('express-validator');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');
var config = require('./config.js');

module.exports = function(){
	var app = express();
	if (process.env.NODE_ENV === 'development')
	{
		app.use(morgan('dev'));
	}
	else
	{
		app.use(compression);
	}
	//More info at npm 'express-session'
	app.use(session({
		secret: config.sessionSecret,
		resave: false,
		saveUninitialized: true
	}));
	app.use(flash());
	app.use(passport.initialize());
	app.use(passport.session()); //use 'express-session'
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
	app.use(validator());

	//Use the relative path from server.js
	app.set('views', './app/views');
	app.set('view engine', 'pug');

	require('../app/routes/index.routes')(app);
	require('../app/routes/user.routes')(app);

	app.use(express.static('./public'));
	return app;
}
