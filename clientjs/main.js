$(document).ready(function() {
	(function() {
		var canvas = new Canvas('my-canvas');
		// var toolbox = new Toolbox('my-toolbox', canvas);
		var click_ears = new ClickListeners();
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
	})();
});