$(document).ready(function () {

	var tags = [],
		all_tags_loaded = false;

	$('#see-more-tags, #see-more-projects').one('click', function () {
		setTags('all');
	});

	var setProjects = function (tags) {
		$.post('/projects', { data : tags }, function (res) {
			$('#home').hide().html(res).fadeIn('slow');
			bindProjectHover();
			bindProjectLink();
		});
	};

	var bindProjectLink = function () {
		$('.project').on('click', function () {

			if (window.window_width <= 480 && !$(this).data('clicked')) {
				$(this).find('.info').css('height', '100%');
				$(this).data('clicked', true);
			} else {
				window.open($(this).data('link'), '_blank');
			}
		});
		$('.project').find('.github_link').on('click', function (e) {
			e.stopPropagation();
		});
	};

	var setTags = function (tags) {

		$.post('/tags', function (res) {
			$('#tag-container').html(res);
			$('#see-more-tags, #see-more-projects').hide();
			setProjects(tags);
			bindTagClick();
			all_tags_loaded = true;
		});
	};

	var bindTagClick = function () {
		$('.tag').on('click', function() {
			$el = $(this);
			$el_text = $el.find('span').text();
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

	var getClients = function () {
		$.get('/work/clients', function (res) {
			$('#clients').hide().html(res).fadeIn('slow');
		});
	};

	bindProjectHover();
	bindProjectLink();
	bindTagClick();
});
