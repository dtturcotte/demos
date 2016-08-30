
var fs = require("fs");
var projects = require('../../data/projects.json');
var tags = require('../../data/tags.json');

var getProjects = function (tags) {
	console.log('getting projects', tags);
	var results = (tags) ? [] : projects;
	var ids = [];
	projects.forEach(function (p) {
		for (var i = 0; i < tags.length; i++) {
			if (p.tags.indexOf(tags[i]) > -1 && ids.indexOf(p.id) === -1) {
				results.push(p);
				ids.push(p.id);
			}
		}
	});
	return results;
};

module.exports = {

	/**
	 * Render page: @TODO - shouldn't need to repeat the logic in Projects
	 * 				But the projects and tags partials require data on initial load
	 *
	 * @param req
	 * @param res
	 */
	index : function (req, res) {
		var tags_limit = tags.map(function (t) {
			return t;
		});

		var tag_names = tags.map(function (t) {
			return t.name;
		});

		tags_limit.length = 5;
		tag_names.length = 5;

		res.render('index', {
			data : getProjects(tag_names),
			tags : tags_limit
		});
	},

	/**
	 * Render tags partial with tags
	 *
	 * @param req
	 * @param res
	 */
	tags : function (req, res) {
		res.render('partials/tags', {
			tags: tags
		});
	},

	/**
	 * Get projects based on tags
	 *
	 * @param req
	 * @param res
	 */
	projects : function (req, res) {

		var requested_tag_names = req.body.data,
			filter_projects = projects.map(function (p) {
				return p;
			});

		/*
			If no selected tags (user selected then deselected single tag), return projects for initial 5 tags
		 */
		if (requested_tag_names && requested_tag_names === 'initial') {
			var tag_names = tags.map(function (t) {
				return t.name;
			});
			tag_names.length = 5;
			filter_projects = getProjects(tag_names);
		}
		/*
			If there are selected tags, get projects for those tags
		 */
		else if (requested_tag_names && requested_tag_names !== 'all') {
			filter_projects = getProjects(requested_tag_names);
		}
		// Else default to full project set

		res.render('partials/projects', {
			data: filter_projects,
			tags: tags
		});
	}
};
