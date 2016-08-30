$(document).ready(function () {

	var url = htws.url + '&limit=' + htws.art_limit + '&mw=' +  htws.max_width + '&mh=' +  htws.max_height + '&site=' + htws.site  + '&callback=?';

	var results = [];
	var links = [];

	$.getJSON(url, function (artwork) {
		results = artwork.fullpath;
		links = artwork.link;
		htws.site = 'comics';
		url = htws.url + '&limit=' + htws.comics_limit + '&mw=' +  htws.max_width + '&mh=' +  htws.max_height + '&site=' + htws.site  + '&callback=?';
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
});
