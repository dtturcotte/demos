$(document).ready(function () {

	var tags = [],
		all_tags_loaded = false;

	$('#see-more-tags').on('click', function () {
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
			window.open($(this).data('link'), '_blank');
		});
		$('.project').find('.github_link').on('click', function (e) {
			// prevent parent project event handler from firing on nested github icon click
			e.stopPropagation();
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
	bindProjectLink();
	bindTagClick();
});
