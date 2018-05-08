$(function () {
	$(".boxscroll1").niceScroll(".contentscroll1",{cursorborder:"",cursorcolor:"#464c52",boxzoom:true});
	$(".boxscroll2").niceScroll(".contentscroll2",{cursorborder:"",cursorcolor:"#464c52",boxzoom:true});
	$(".boxscroll3").niceScroll(".contentscroll3",{cursorborder:"",cursorcolor:"#464c52",boxzoom:true});
	$(".boxscroll4").niceScroll(".contentscroll4",{cursorborder:"",cursorcolor:"#464c52",boxzoom:true});
	$(".boxscroll5").niceScroll(".contentscroll5",{cursorborder:"",cursorcolor:"#464c52",boxzoom:true});
	$(".boxscroll6").niceScroll(".contentscroll6",{cursorborder:"",cursorcolor:"#464c52",boxzoom:true});

	$(".head-navbar li").hover(function () {
		$(this).find('.subordinate-menu').stop(true).fadeIn(500).parent().siblings().find('.subordinate-menu').fadeOut(0);
	}, function () {
		$(this).find('.subordinate-menu').fadeOut(0);
	})
});

// table效果;
function tableSwiper(hoverElm, contentElm) {
	$(hoverElm).hover(function () {
		var Index = $(this).index();
		var wid = $(contentElm).width();

		$(this).addClass('active').siblings().removeClass('active');
		$(contentElm).find('ul').stop(true).animate({
			marginLeft: '-' + wid*Index + 'px'
		}, 500)
	})
}