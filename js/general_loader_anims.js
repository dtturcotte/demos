$(document).ready(function () {
	$('img').fadeIn();

	var nav_url = location.pathname;

	$('.nav-items').find('span').each(function () {
		if ($(this).data('url') === nav_url) {
			$(this).parent().addClass('active');
		}
	});
});
