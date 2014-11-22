$(document).ready(function() {
	(function() {
		if($('#my-canvas').length >= 1) {
			var canvas = new Canvas('my-canvas');
			// var toolbox = new Toolbox('my-toolbox', canvas);
			var click_ears = new Listeners();
		}
		
		//creates the cool bootstrap overlay dealio
		$('#myModal').modal({
			'backdrop': 'static',
			'keyboard': false,
			'show': true
		});
	})();
});