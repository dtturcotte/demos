var users = require('../../data/alexa_data/users.json');

module.exports = {

	getUser : function (req, res, next) {
		console.log('ALEXA GET USER', req.params);
		return res.send(JSON.stringify(users));
	}

};
