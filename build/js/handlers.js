$(document).ready(function () {

	var tags = [],
		all_tags_loaded = false;

	var htws = {
		url : 'http://hittingtreeswithsticks.com/?action=personalpage',
		limit : 43, // limit return
		max_width : 100, // specify image size in px
		max_height : 100,
		site : 'artwork' // or comics
	};

	var url = htws.url + '&limit=' + htws.limit + '&mw=' +  htws.max_width + '&mh=' +  htws.max_height + '&site=' + htws.site  + '&callback=?';

	var layouts = [
		'grid-item',
		'grid-item grid-item--width2',
		'grid-item grid-item--height2',
		'grid-item grid-item--width2 grid-item--height2'
	];

	var results = [];
	var links = [];

	$.getJSON(url, function (artwork) {
		results = artwork.fullpath;
		links = artwork.link;

		htws.site = 'comics';
		htws.limit = 75;
		url = htws.url + '&limit=' + htws.limit + '&mw=' +  htws.max_width + '&mh=' +  htws.max_height + '&site=' + htws.site  + '&callback=?';
		$.getJSON(url, function (comics) {
			results = (comics.fullpath) ? results.concat(comics.fullpath) : results;
			links = (comics.link) ? links.concat(comics.link) : links;
			for (var i = 0; i < results.length; i++) {
				var rand = Math.floor(Math.random() * (layouts.length));
				var $grid_item = $('<div class="' + layouts[rand] + '">');
				var $overlay_link = $('<a target="_blank" class="grid-overlay" href="' + links[i] +'">');

				$('.grid').append($grid_item);

				$grid_item.append(results[i]);
				$grid_item.append($overlay_link);

				$grid_item.find('img').css('display', 'none');
				$grid_item.find('img').one('load', function () {
					$(this).fadeIn(1000);
				});
			};

			$('.grid').isotope({
				layoutMode: 'packery',
				itemSelector: '.grid-item'
			});
		});
	});

	$('#see-more-tags').on('click', function () {
		setTags('all');
	});

	var setProjects = function (tags) {
		$.post('/projects', { data : tags }, function (res) {
			$('#home').html(res);
			bindProjectHover();
		});
	};

	var setTags = function (tags) {

		$.post('/tags', function (res) {
			$('#tag-container').html(res);
			$('#see-more-tags').hide();
			setProjects(tags);
			bindTagClick();
			all_tags_loaded = true;
		});
	};

	var bindTagClick = function () {
		$('.tag').on('click', function() {
			$el = $(this);
			$el_text = $el.find('span').text();
			console.log('clicked', $el_text);
			if ($el.hasClass('clicked')) {
				$el.removeClass('clicked');
				var index = tags.indexOf($el_text);
				if (index > -1) {
					tags.splice(index, 1);
				}
			} else {
				$el.addClass('clicked');
				tags.push($el_text);
			}
			var tag_input = (tags.length === 0 && !all_tags_loaded) ? 'initial' : tags;
			console.log('setting projects', tag_input);
			setProjects(tag_input);
		});
	};

	var bindProjectHover = function () {
		$('.project > .info').hover(function () {
			$(this).parent().find('.images').addClass('blur');
		}, function () {
			$(this).parent().find('.images').removeClass('blur');
		});
	};

	bindProjectHover();
	bindTagClick();
});
