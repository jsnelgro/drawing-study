var ClickListeners = (function() {

	var _this;
	var _timer = 0;

	function ClickListeners() {
		_this = this;

		$('#my-form').submit(function(event) {
			console.log('submitted');
			// uggghhhh god I hate html forms. I shouldn't have even bothered with them.
			var data = JSON.parse(JSON.stringify($(this).serializeObject()));
			var img = document.getElementById('my-canvas').toDataURL();
			data.img = img;
			data.word = document.getElementById('meta-word').content;
			data.duration = _timer;

			$.ajax({
					url: '/data',
					type: 'POST',
					dataType: 'json',
					data: data
				})
				.done(function() {
					console.log("success");
				})
				.fail(function() {
					console.log("error");
				})
				.always(function() {
					console.log("complete");
				});
			$('#modal-continue-btn').unbind('click');
			document.getElementById('modal-body-id').innerHTML = 'Thank you for your participation! If you would like to learn more, you can email john_snelgrove@brown.edu. You may now close the page to finish the study.';
			$('#submit-btn').attr('disabled', 'disabled');
			event.preventDefault();
		});

		var p = document.getElementById('audio-player');
		$('.audio-play-btn').click(function(event) {
			if (p.paused) {
				p.play();
			}
		});

		$('.start-stop-timer').click(function(event) {
			if (_timer === 0) {
				_timer = $.now();
			} else {
				_timer = $.now() - _timer;
				// console.log(_timer);
			}

		});

		$('#clear-btn').click(function(event) {
			var retVal = confirm("Are you sure you want to clear your drawing?");
			if (retVal == true) {
				var canvas = document.getElementById('my-canvas');
				var context = canvas.getContext('2d');
				context.clearRect(0, 0, canvas.width, canvas.height);
				return true;
			} else {
				return false;
			}
		});

	}

	ClickListeners.prototype.add_listener = function(btn_id, behavior) {
		if (btn_id[0] !== '#') {
			btn_id.prepend('#');
		}
		$(btn_id).click(behavior);
	};

	ClickListeners.prototype.post_req = function(url, data) {
		$.ajax({
				url: url,
				type: 'POST',
				dataType: 'json',
				data: data,
			})
			.done(function() {
				console.log("ajax POST success");
			})
			.fail(function() {
				console.log("ajax POST error");
			})
			.always(function() {
				console.log("ajax POST complete");
			});

	};

	$.fn.serializeObject = function() {
		var o = {};
		var a = this.serializeArray();
		$.each(a, function() {
			if (o[this.name] !== undefined) {
				if (!o[this.name].push) {
					o[this.name] = [o[this.name]];
				}
				o[this.name].push(this.value || '');
			} else {
				o[this.name] = this.value || '';
			}
		});
		return o;
	};

	return ClickListeners;

})();