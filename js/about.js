var d3 = require('d3'),
	cloud = require('d3.layout.cloud');

$(document).ready(function () {

	localStorage.clear();
	if (localStorage.getItem('quiz_answered') === null) {

		$('#music_quiz_input').keypress(function (e) {
			if (e.which == 13) {
				sendAnswer();
				return false;
			}
		});

		$('#music_quiz_input_button').one('click', function () {
			sendAnswer();
		});

	} else {
		$.get('https://musicquiz-79603.firebaseio.com/.json', generateCloud);
		appendResultText(localStorage.getItem('quiz_answered'));
	}

	function sendAnswer() {
		var answer = JSON.stringify({
			'guess': $('#music_quiz_input').val()
		});

		$.post('https://musicquiz-79603.firebaseio.com/.json', answer, function (res) {
			$.get('https://musicquiz-79603.firebaseio.com/.json', generateCloud);

			$.get('/about/verify?guess=' + $('#music_quiz_input').val(), function (result) {
				appendResultText(result);
			});
		});
	}

	function generateCloud(res) {

		var guesses = [];
		for (var g in res) {
			if (res[g].guess) {
				guesses.push(res[g].guess);
			}
		}

		if (guesses.length) {
			var font_sizes = {};
			for (var i = 0; i < guesses.length; i++) {
				font_sizes[guesses[i]] = ++font_sizes[guesses[i]] || 1;
			}

			var unique_words = [];
			$.each(guesses, function (i, el) {
				if ($.inArray(el, unique_words) === -1) unique_words.push(el);
			});

			var fill = d3.scale.category20();

			var layout = cloud()
				.size([500, 500])
				.words(unique_words.map(function (d) {
					return {text: d, size: font_sizes[d] * 5, test: "haha"};
				})
			)
				.padding(5)
				.rotate(function () {
					return ~~(Math.random() * 2) * 90;
				})
				.font("Impact")
				.fontSize(function (d) {
					console.log('size', d.size);
					return d.size;
				})
				.on("end", draw);

			layout.start();

		}

		function draw (words) {
			d3.select("#quiz").append("svg")
				.attr("width", layout.size()[0])
				.attr("height", layout.size()[1])
				.append("g")
				.attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
				.selectAll("text")
				.data(words)
				.enter().append("text")
				.style("font-size", function(d) {
					d.size = (d.size >= 80) ? 80 : d.size;
					return d.size + "px";
				})
				.style("font-family", "Impact")
				.style("fill", function(d, i) { return fill(i); })
				.attr("text-anchor", "middle")
				.attr("transform", function(d) {
					return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
				})
				.text(function(d) { return d.text; });
		};

	}

	function appendResultText (res) {

		$('#quiz').fadeIn('slow');
		$('#music_quiz_input_container').fadeOut('fast');
		var $result = (res) ? $('<h3>+10pts! Mr. Mark Knopfler!</h3>') : $('<h3 class="incorrect">Nope. Was it my crappy drawing?</h3>'),
			$others = $('<p>Here\'s what others have been guessing:</p>');

		if (localStorage.getItem('quiz_answered') === null) {
			localStorage.setItem('quiz_answered', res);
		}

		$('#result').append($result).append($others);
	}

});
