
var fs = require("fs");
var projects = require('../../data/projects.json');

module.exports = {

	index : function (req, res) {
		res.render('index', {
			data: projects
		});
	},

	tags : function (req, res) {
		var tags = req.body.data;
		var results = (tags) ? [] : projects;
		var ids = [];

		if (tags) {
			projects.forEach(function (p) {
				for (var i = 0; i < p.tags.length; i++) {
					if (tags.indexOf(p.tags[i]) > -1 && ids.indexOf(p.id) === -1) {
						results.push(p);
						ids.push(p.id);
					}
				}
			});
		}
		res.render('partials/projects', {
			data: results
		});
	}
};
