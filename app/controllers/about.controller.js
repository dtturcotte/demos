module.exports = {

	index : function (req, res) {
		return res.render('pages/about');
	},

	quiz : function (req, res) {
		var answer = 'mark knopfler';
		return res.send(req.query.guess.trim().toLowerCase() === answer);
	},

	/**
	 * Naive profanity checker (Not going with regex because it's hard to cover every case
	 *
	 * @param req
	 * @param res
	 * @returns {*}
	 */
	sanitize : function (req, res) {
		var bad_words = JSON.stringify(require('../../data/sanitization/bad_words.json'));

		var input = req.query.word.trim();

		if (!input) {
			return res.send('no input');
		}

		input = input.toLowerCase().split(' ');

		for (var i = 0; i < input.length; i++) {
			if (bad_words.indexOf(input[i]) > -1) {
				return res.send('bad word');
			}
		}
		return res.send('okay');

	}
};

