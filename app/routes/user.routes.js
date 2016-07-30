var passport = require('passport');

module.exports = function(app){
	var user = require('../controllers/user.controller');

	app.route('/login')
		.get(user.renderLogin)
		.post(passport.authenticate('local', {
			successRedirect: '/',
			failureRedirect: '/login',
			failureFlash: true
		}));

	app.route('/oauth/facebook')
		.get(passport.authenticate('facebook', {
			failureRedirect: '/login',
			scope: 'email'
		}));

	app.route('/oauth/facebook/callback')
		.get(passport.authenticate('facebook', {
			failureRedirect: '/login',
			successRedirect: '/'
		}));

	app.route('/logout')
		.post(user.logout);

	app.route('/signup')
		.get(user.renderSignup)
		.post(user.signup);

	app.route('/user')
		.post(user.create)
		.get(user.list);

	app.route('/user/:username')
		.get(user.read)
		.put(user.update)
		.delete(user.delete);
	app.param('username', user.userByUsername);
}