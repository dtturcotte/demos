var tags = require('../../data/tags.json');

module.exports = {

	index : function (req, res, next) {

		return res.render('pages/skills', {
			tags: tags
		});
	}

};
