var users = require('../../data/alexa_data/users.json');
var orders = require('../../data/alexa_data/orders.json');

module.exports = {

	getUser : function (req, res, next) {
		var user = users[0];
		console.log('ALEXA GET USER', JSON.stringify(user));
		return res.send(JSON.stringify(user));
	},

	getUserOrders : function (req, res, next) {
		var orders = orders[0];
		console.log('ALEXA GET USER ORDERS', JSON.stringify(orders));
		return res.send(JSON.stringify(orders));
	}
};
