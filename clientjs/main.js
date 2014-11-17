$(document).ready(function() {
	(function() {
		var canvas = new Canvas('my-canvas');
		// var toolbox = new Toolbox('my-toolbox', canvas);
		var click_ears = new ClickListeners();
		
		$('#myModal').modal({
			'backdrop': 'static',
			'keyboard': false,
			'show': true
		});

		function orientationChange() {
			// redraw hack for iphone orientation change bug
			switch (window.orientation) {
				case -90:
				case 90:
				default:
					var element = document.getElementById('body');
					var n = document.createTextNode(' ');
					var disp = element.style.display;
					element.appendChild(n);
					element.style.display = 'none';
					setTimeout(function() {
						element.style.display = disp;
						n.parentNode.removeChild(n);
					}, 20);
					break;
			}
		}
		window.addEventListener('orientationchange', orientationChange);

		// Smooth scroll for in page links
		var target, scroll;

		$("#test-area").on("shown.bs.collapse", function(e) {
			// if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
				// target = $('#test-area');
				// target = target.length ? target : $("[id=" + this.hash.slice(1) + "]");

				// if (target.length) {
				// 	if (typeof document.body.style.transitionProperty === 'string') {
				// 		e.preventDefault();

				// 		var avail = $(document).height() - $(window).height();

				// 		scroll = target.offset().top;

				// 		if (scroll > avail) {
				// 			scroll = avail;
				// 		}

				// 		$("html").css({
				// 			"margin-top": ($(window).scrollTop() - scroll) + "px",
				// 			"transition": "1s ease-in-out"
				// 		}).data("transitioning", true);
				// 	} else {
				// 		$("html, body").animate({
				// 			scrollTop: scroll
				// 		}, 1000);
				// 		return;
				// 	}
				// }
				
				$('#drawing-div').slideUp('slow/400/fast', function() {
					$('.finished-btn').attr('disabled', 'disabled');					
				});
			// }
		});

		// $("html").on("transitionend webkitTransitionEnd msTransitionEnd oTransitionEnd", function(e) {
		// 	if (e.target == e.currentTarget && $(this).data("transitioning") === true) {
		// 		$(this).removeAttr("style").data("transitioning", false);
		// 		$("html, body").scrollTop(scroll);
		// 		return;
		// 	}
		// });

	})();
});