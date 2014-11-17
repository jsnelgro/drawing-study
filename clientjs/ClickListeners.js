var ClickListeners = (function() {

	var _this;

	function ClickListeners() {
		_this = this;

		$('#my-form').submit(function(event) {
			console.log('submitted');
			// uggghhhh god I hate html forms. I shouldn't have even bothered with them.
			var data = JSON.parse(JSON.stringify($(this).serializeObject()));
			var img = document.getElementById('my-canvas').toDataURL();
			data.img = img;

			$.ajax({
					url: '/data',
					type: 'POST',
					dataType: 'json',
					data: data
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

			event.preventDefault();
		});

		// this.add_listener('submit-btn', function() {
		// 	//todo get data and format to json
		// 	var data = {'hi':'hello'};
		// 	_this.post_req(document.URL+'data', data);
		// });

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