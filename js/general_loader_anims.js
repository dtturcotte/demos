$(document).ready(function () {
	$('img').fadeIn();

	var nav_url = location.pathname;

	var $window = $(window);

	window.window_width = $window.width();

	$('.nav-items').find('span').each(function () {
		if ($(this).data('url') === nav_url) {
			$(this).parent().addClass('active');
		}
	});

	$(window).resize(function () {
		console.log($window.width());
		window.window_width = $window.width();
	});
});
