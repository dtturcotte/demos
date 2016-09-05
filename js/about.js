$(document).ready(function () {

	//$.get('https://musicquiz-79603.firebaseio.com/music_quiz.json', function (res) {
	//	console.log('music data', res);
	//});


	//$.get('/about/words', function (res) {
	//	console.log('music data', JSON.parse(res));
	//	$('#quiz').append('<svg>')
	//		.attr('width', "1000px")
	//		.attr('height', "1000px")
	//
	//		.text(JSON.parse(res));
	//});

	var word_list = [
		'mark', 'mark', 'knopfler', 'tom', 'petty', 'mark', 'knopfler'
	];

	// assign text sizes based on occurances


	var d3 = require('d3'),
		cloud = require('d3.layout.cloud');

	var fill = d3.scale.category20();

	var layout = cloud()
		.size([500, 500])
		.words([
			"Mark", "Knopfler", "tom", "petty", "petty", "petty", "dire", "straits",
			"than", "this"].map(function(d) {
				return {text: d, size: 10 + Math.random() * 90, test: "haha"};
			}))
		.padding(5)
		.rotate(function() { return ~~(Math.random() * 2) * 90; })
		.font("Impact")
		.fontSize(function(d) {
			console.log('size', d);
			return d.size;
		})
		.on("end", draw);

	layout.start();

	function draw(words) {
		console.log('DRAW');
		d3.select("#quiz").append("svg")
			.attr("width", layout.size()[0])
			.attr("height", layout.size()[1])
			.append("g")
			.attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
			.selectAll("text")
			.data(words)
			.enter().append("text")
			.style("font-size", function(d) { return d.size + "px"; })
			.style("font-family", "Impact")
			.style("fill", function(d, i) { return fill(i); })
			.attr("text-anchor", "middle")
			.attr("transform", function(d) {
				return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
			})
			.text(function(d) { return d.text; });
	}
});
