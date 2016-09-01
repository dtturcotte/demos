//var users = require('../../data/alexa_data/users.json');
//var orders = require('../../data/alexa_data/orders.json');
//var suppliers = require('../../data/alexa_data/suppliers.json');
//var special_offers = require('../../data/alexa_data/special_offers.json');

module.exports = {

	getUser : function (req, res, next) {
		var users = require('../../data/alexa_data/users.json');
		var user = users[0];
		console.log('ALEXA GET USER', JSON.stringify(user));
		return res.send(JSON.stringify(user));
	},

	getUserOrders : function (req, res, next) {
		var orders = require('../../data/alexa_data/orders.json');
		var order = orders[0];
		console.log('ALEXA GET USER ORDERS STRINGIFIED', JSON.stringify(order));
		console.log('ALEXA GET USER ORDERS', order);
		var stringify = JSON.stringify(order);
		return res.send(stringify);
	},

	getSupplierByLocation : function (req, res, next) {
		var suppliers_locations = require('../../data/alexa_data/suppliers.json');
		var suppliers = suppliers_locations[0];
		console.log('ALEXA GET SUPPLIERS STRINGIFIED', JSON.stringify(suppliers));
		console.log('ALEXA GET SUPPLIERS', suppliers);
		var stringify = JSON.stringify(suppliers);
		return res.send(stringify);
	},

	getSpecialOffers : function (req, res, next) {
		var special_offers = require('../../data/alexa_data/special_offers.json');
		var special_offer = special_offers[0];
		console.log('ALEXA GET SPECIAL OFFERS STRINGIFIED', JSON.stringify(special_offer));
		console.log('ALEXA GET SPECIAL OFFERS', special_offer);
		var stringify = JSON.stringify(special_offer);
		return res.send(stringify);
	}

};
