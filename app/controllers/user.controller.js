var User = require('mongoose').model('User');
var passport = require('passport');

var getErrorMessage = function(err){
	var message = '';

	//Index Error
	if (err.code){
		switch (err.code) {
			case 11000:
			case 11001:
				message = "Username is already existed."
				break;
			default:
				message = 'Something went wrong';
				break;
		}
	}
	//Validation Error
	else{
		for (var errName in err.errors) {
			if (err.errors[errName].message) {
				message = err.errors[errName].message 
			}
		}
	}
	return message;
}

exports.saveOAuthUserProfile = function(req, profile, done){
	User.findOne({
		provider: profile.provider,
		providerId: profile.providerId
	}, function(err, user){
		if (err) return done(err);
		else{
			if (!user){
				var possibleUsername = profile.username || (profile.email ? profile.email.split('@')[0] : '');
				User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
					profile.username = availableUsername;
					user = new User(profile);
					user.save(function(err) {
						if (err){
							var message = getErrorMessage(err);
							req.flash('error', message);
							return res.redirect('/signup');
						}
						return done(err, user);
					})
				});
			}
			else{
				return done(err, user);
			}
		}
	});
}

exports.renderLogin = function(req, res){
	if (!req.user){
		res.render('login', {
			title: 'Log in',
			messages: req.flash('error') || req.flash('info')
		})
	}
	else {
		return res.redirect('/');
	}
}

exports.logout = function(req, res){
	//logout() method is attached to every request autumatically by Passport Module
	req.logout();
	res.redirect('/');
}

exports.renderSignup = function(req, res){
	if (!req.user){
		res.render('signup', {
			title: 'Sign up',
			messages: req.flash('error')
		});
	}
	else{
		return res.redirect('/');
	}
}

exports.signup = function(req, res, next){
	//If the user is currently logged in,
	//user property is attached to every request automatically by Passport Module
	if (!req.user) {
		var user = new User(req.body);
		user.provider = 'local';

		user.save(function(err) {
			if (err) {
				var message = getErrorMessage(err);

				req.flash('error', message);
				return res.redirect('/signup');
			};

			//login() method is attached to every request autumatically by Passport Module
			req.login(user, function(err){
				if (err) return next(err);
				return res.redirect('/');
			});
		});
	}
	else
	{
		return res.redirect('/');
	}
}

exports.create = function(req, res, next){
	var user = new User(req.body);

	user.save(function(err){
		if (err){
			return next(err);
		}
		else{
			res.json(user);
		}
	});
}

exports.list = function(req, res, next){
	User.find({}, function(err, users){
		if (err){
			return next(err);
		}
		else{
			res.json(users);
		}
	});
}

exports.read = function(req, res, next){
	res.json(req.user);
}

exports.update = function(req, res, next){
	User.findOneAndUpdate({username: req.user.username}, req.body, function(err, user){
		if (err) {
			return next(err);
		}
		else
		{
			res.json(user);
		}
	});
}

exports.delete = function(req, res, next){
	req.user.remove(function(err){
		if (err){
			return next(err);
		}
		else{
			res.json(req.user);
		}
	});
}

exports.userByUsername = function(req, res, next, username){
	User.findOne({
		username: username
	}, function(err, user){
		if (err){
			return next(err);
		}
		else {
			req.user = user;
			next();
		}
	});
}