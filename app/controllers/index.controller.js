exports.render = function(req, res){

	res.render('index', {
		title : 'Hello, Express',
		username : req.user ? req.user.username : ''
	});
}