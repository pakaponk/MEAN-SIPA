var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('../config.js');
var user = require('../../app/controllers/user.controller');

module.exports = function(){
	passport.use(new FacebookStrategy({
		clientID: config.facebook.clientID,
		clientSecret: config.facebook.clientSecret,
		callbackURL: config.facebook.callbackURL,
		profileFields: ['id', 'email', 'name'],
		passReqToCallback: true
	}, function(req, accessToken, refreshToken, profile, done){
		var providerData = profile._json;
		providerData.accessToken = accessToken;
		providerData.refreshToken = refreshToken;

		var providerUserProfile = {
			firstName: profile.name.givenName,
			lastName: profile.name.familyName,
			email: profile.emails[0].value,
			username: profile.username,
			provider: 'facebook',
			providerId: profile.id,
			providerData: providerData
		};
		user.saveOAuthUserProfile(req, providerUserProfile, done);
	}));
}