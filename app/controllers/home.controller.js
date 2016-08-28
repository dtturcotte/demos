
var fs = require("fs");

module.exports.index = function (req, res) {
	var projects = require('../../data/projects.json');

	return res.render('index', {
		data : projects
	});
};
