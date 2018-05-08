$(function () {
	$('body').fadeIn(50);
	if ($('.btn-group')) {
		$('.btn-group').on('touchend', function () {
			$(this).find('.loading').fadeIn(50, function () {
				setTimeout(function () {
					$(this).fadeOut(200);
				}.bind(this), 2000);
			});
		});
	}
});