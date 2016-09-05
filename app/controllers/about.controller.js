var d3 = require('d3'),
	cloud = require('d3.layout.cloud'),
	browserify = require('browserify');


var Canvas = require("canvas");

var needful = function (callback) {

	var words = ["Hello", "world", "normally", "you", "want", "more", "words", "than", "this"]
		.map(function(d) {
			return {text: d, size: 10 + Math.random() * 90};
		});

	return new Promise(function (resolve, reject) {
		cloud().size([960, 500])
			.canvas(function () {
				return new Canvas(1, 1);
			})
			.words(words)
			.padding(5)
			.rotate(function () {
				return ~~(Math.random() * 2) * 90;
			})
			.font("Impact")
			.fontSize(function (d) {
				return d.size;
			})
			.on("end", function () {
				return resolve(JSON.stringify(words))
			})
			.start();
	});

};


module.exports = {

	index : function (req, res, next) {
		return res.render('pages/about');
	},

	words : function (req, res, next) {
		console.log('getting words');
		return needful().then(res.send.bind(res));
	}
};

