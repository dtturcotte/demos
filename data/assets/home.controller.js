
var projects = require('../../data/projects.json');
var tags = require('../../data/tags.json');
var clients = require('../../data/clients.json');
var rp = require('request-promise');
var product_name = 'Lexicana\'s Destiny';
var product_tagline = 'A game before anything else, with language learning at its core.';

var getProjects = function (tags) {

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

var getTags = function (projects) {

	var project_tags = [],
		names = [];

	projects.forEach(function (p) {
		tags.forEach(function (t) {
			if (p.tags.indexOf(t.name) > -1 && names.indexOf(t.name) === -1) {
				project_tags.push(t);
				names.push(t.name);
			}
		});
	});

	return project_tags;
};

var getRecommendations = function () {
	return rp('https://api.linkedin.com/v1/people/~:(id,first-name,recommendations-received:(id,recommendation-type,recommendation-text,recommender))?oauth2_access_token=AQX128wrEx3uxMgM__T3NvRaf82sUB4vKO4O0t3AksDJSpQBdREb-DTqSRrq_LtFfcvq2PTUy5iFOui4WjZ14U7AF5g1UB0sGmYS07gwK9Wm1wb9z8PmqzrrYjMSBFUYXRM6hpL1b3xa2XFhfHGQqsllqeVrq04RxL6dw_MavN4cIfze3_o&format=json');
};

module.exports = {

	/*
		On initial page load...
		- Load 5 selected projects
		- Load tags into tags page based on the tags in these projects
	 */
	index : function (req, res) {
		var projects_limit = projects.map(function (p) {
			return p;
		});

		projects_limit.length = 6;
		getRecommendations().then(function(data) {
			res.render('index', {
				data : projects_limit,
				clients : clients,
				tags : getTags(projects_limit),
				recommendations : data,
				product_name: product_name,
				product_tagline: product_tagline
			});
		}).catch(function (err) {
			res.render('index', {
				data : projects_limit,
				clients : clients,
				tags : getTags(projects_limit),
				recommendations : null,
				product_name: product_name,
				product_tagline: product_tagline
			});
		});

	},

	/**
	 * Render information page about language game
	 *
	 * @param req
	 * @param res
	 */
	edtech : function(req, res) {
		res.render('pages/learn-language', {
			product_name: product_name,
			product_tagline: product_tagline
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
	 * Render clients
	 *
	 * @param req
	 * @param res
	 */
	clients : function (req, res) {
		res.render('partials/clients', {
			clients: clients
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
			tag_names.length = 6;
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
			clients : clients,
			tags: tags
		});
	}
};
