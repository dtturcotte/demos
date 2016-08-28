module.exports = {

	stuff : function (req, res, next) {
		return res.render('pages/me', {
			data: 'DATA'
		});
	}

};
