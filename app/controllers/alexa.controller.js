module.exports = {

	getUser : function (req, res, next) {
		var users = require('../../data/alexa_data/users.json');
		var user = users[0];
		return res.send(JSON.stringify(user));
	},

	getUserOrders : function (req, res, next) {
		var orders = require('../../data/alexa_data/orders.json');
		var order = orders[0];
		var stringify = JSON.stringify(order);
		return res.send(stringify);
	},

	getSupplierByLocation : function (req, res, next) {
		var suppliers_locations = require('../../data/alexa_data/suppliers.json');
		var suppliers = suppliers_locations[0];
		var stringify = JSON.stringify(suppliers);
		return res.send(stringify);
	},

	getSpecialOffers : function (req, res, next) {
		var special_offers = require('../../data/alexa_data/special_offers.json');
		var special_offer = special_offers[0];
		var stringify = JSON.stringify(special_offer);
		return res.send(stringify);
	},

	postUserOrder : function (req, res, next) {
		var dummy_post_res = {
			"status" : 200,
			"message" : "order placed",
			"number" : 1
		};

		var stringify = JSON.stringify(dummy_post_res);
		return res.send(stringify);
	}


};
