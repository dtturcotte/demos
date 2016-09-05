module.exports = {

	index : function (req, res) {
		return res.render('pages/about');
	},

	quiz : function (req, res) {
		var answer = 'mark knopfler';
		return res.send(req.query.guess.trim().toLowerCase() === answer);
	}
};

