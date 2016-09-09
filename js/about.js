var d3 = require('d3'),
	cloud = require('d3.layout.cloud');

$(document).ready(function () {
	
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
	}

	$('#play_spotify').one('click', function () {
		if ($('#spotify').is(':empty')) {
			$('#spotify').append('<p>Give a listen if you have Spotify</p>' +
			'<iframe src="https://embed.spotify.com/?uri=spotify%3Aartist%3A0WwSkZ7LtFUFjGjMZBMt6T" style="margin: 30px 0" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>');
		}
	});

	function sendAnswer() {
		if ($('#music_quiz_input').val() === '') {
			showMessage('<h3 class="incorrect">Please provide an answer!</h3>');
		} else if (($('#music_quiz_input').val().length > 50)) {
			showMessage('<h3 class="incorrect">Answer should be shorter than 100 characters!</h3>');
		} else {
			sanitize($('#music_quiz_input').val()).then(function (status) {

				if (status === 'okay') {

					var input = $('#music_quiz_input').val();

					var answer = JSON.stringify({
						'guess': input
					});

					$.post('https://musicquiz-79603.firebaseio.com/.json', answer, function (res) {
						$.get('https://musicquiz-79603.firebaseio.com/.json', generateCloud);

					});
				} else if (status === 'bad word') {
					showMessage('<h3 class="incorrect">' + $('#music_quiz_input').val() + ' is naughty! Naughty naughty...</h3>');
				} else {
					showMessage('<h3 class="incorrect">Please provide an answer!</h3>');
				}
			});
		}
	}

	function showMessage(message) {

		if ($('#result').is(':empty')) {

			$('#result').html(message);

			var newTimeout = setTimeout(function () {
				clearTimeout(newTimeout);
				$('#result').html('');
				$('#music_quiz_input').val('');
			}, 4000)
		} else {
			alert('Please do not spam :)');
		}
	}

	function sanitize(input) {
		return $.get('/about/sanitize?word=' + input);
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
				.size([400, 500])
				.words(unique_words.map(function (w) {
					return {
						text : w,
						size : (font_sizes[w] * 12 <= 80) ? font_sizes[w] * 12 : 80
					}
				}))
				.padding(5)
				.rotate(function () {
					return ~~(Math.random() * 2) * 90;
				})
				.font("Impact")
				.fontSize(function (d) {
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

		$.get('/about/verify?guess=' + $('#music_quiz_input').val(), function (result) {
			appendResultText(guesses, result);
		});

	}

	function appendResultText (guesses, res) {

		$('#quiz').fadeIn('slow');
		$('#music_quiz_input_container').remove();
		var $result = (res) ? $('<p class="heading correct shadow">+10pts! That\'s the way you do it.</p>') : $('<p class="heading incorrect shadow">Nope. That ain\'t workin\'</p>'),
			$others = $('<p>' + guesses.length + ' others have guessed so far:</p>');

		if (localStorage.getItem('quiz_answered') === null) {
			localStorage.setItem('quiz_answered', res);
		}

		$('#result').append($result).append($others);
	}

});
