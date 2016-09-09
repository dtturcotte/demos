$(document).ready(function () {
	$('img').fadeIn();

	var nav_url = location.pathname;

	var $window = $(window);

	var scrolledToTop = true;
	var animating = false;

	window.window_width = $window.width();

	$('.nav-items').find('span').each(function () {
		if ($(this).data('url') === nav_url) {
			$(this).parent().addClass('active');
		}
	});

	$(window).resize(function () {
		window.window_width = $window.width();
	});

	$(window).on('scroll', function() {
		var scrollTop = $(this).scrollTop();
		
		if (window.window_width < 767 && scrollTop > 0 && scrolledToTop && !animating) {
			animating = true;
			$('.nav-items').animate({top:0}, 250, function() {
				scrolledToTop = false;
				animating = false;
			});
		} else if (window.window_width < 767 && scrollTop === 0 && !scrolledToTop) {
			$(".nav-items").css('top', 50 + "px");
			scrolledToTop = true;
		}
	});
});
