module.exports = function (app, globals, path) {

	var home = require(path.join(globals.paths.controllers, 'home.controller'));
	var about = require(path.join(globals.paths.controllers, 'about.controller'));
	var skills = require(path.join(globals.paths.controllers, 'skills.controller'));
	var alexa = require(path.join(globals.paths.controllers, 'alexa.controller'));

	var dantebot = require('../../slack_bots/dantebot');
	var suki = require('../../slack_bots/suki');

	/*
		Define Global View Vars
	 */
	app.use(function (req, res, next) {
		// Expose server vars
		res.locals = {
			static: globals.static
		};
		next();
	});


	/*
		Home
	 */
	app.get('/', about.index);
	app.get('/work', home.index);
	app.post('/projects', home.projects);
	app.post('/tags', home.tags);
	app.get('/about', about.index);
	app.get('/about/verify', about.quiz);
	app.get('/about/sanitize', about.sanitize);
	app.get('/skills', skills.index);

	/*
		Slack Bots
	 */
	app.post('/dante', dantebot);
	app.get('/dante', dantebot);
	app.post('/suki', suki);
	app.get('/suki', suki);

	/*
		Alexa : endpoints to support my Lambda Storefront app
	 */
	app.get('/api/1.0/user', alexa.getUser);
	app.get('/api/1.0/orders', alexa.getUserOrders);
	app.post('/api/1.0/order', alexa.postUserOrder);
	app.get('/api/1.0/suppliers', alexa.getSupplierByLocation);
	app.get('/api/1.0/supplier/offers', alexa.getSpecialOffers);


};
