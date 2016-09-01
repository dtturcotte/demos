var users = require('../../data/alexa_data/users.json');
var orders = require('../../data/alexa_data/orders.json');
var suppliers = require('../../data/alexa_data/suppliers.json');
var special_offers = require('../../data/alexa_data/special_offers.json');

module.exports = {

	getUser : function (req, res, next) {
		var user = users[0];
		console.log('ALEXA GET USER', JSON.stringify(user));
		return res.send(JSON.stringify(user));
	},

	getUserOrders : function (req, res, next) {
		var orders = orders[0];
		console.log('ALEXA GET USER ORDERS STRINGIFIED', JSON.stringify(orders));
		console.log('ALEXA GET USER ORDERS', orders);
		return res.send(orders);
	},

	getSupplierByLocation : function (req, res, next) {
		var suppliers = suppliers[0];
		console.log('ALEXA GET SUPPLIERS STRINGIFIED', JSON.stringify(suppliers));
		console.log('ALEXA GET SUPPLIERS', suppliers);
		return res.send(suppliers);
	},

	getSpecialOffers : function (req, res, next) {
		var special_offers = special_offers[0];
		console.log('ALEXA GET SPECIAL OFFERS STRINGIFIED', JSON.stringify(special_offers));
		console.log('ALEXA GET SPECIAL OFFERS', special_offers);
		return res.send(special_offers);
	}

};
