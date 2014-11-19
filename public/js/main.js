var Canvas = (function() {

	var canvas, stage;
	var drawingCanvas;
	var _tool;
	var _this;

	// Constructor
	function Canvas(canvas_id) {
		canvas = document.getElementById(canvas_id);
		//check to see if we are running in a browser with touch support
		stage = new createjs.Stage(canvas);
		stage.autoClear = false;
		stage.enableDOMEvents(true);

		createjs.Touch.enable(stage);
		createjs.Ticker.setFPS(24);

		drawingCanvas = new createjs.Shape();
		stage.addChild(drawingCanvas);
		this.tool = new Tool(drawingCanvas, stage);
		_tool = this.tool;
		window.addEventListener('resize', this.resizeCanvas, false);
		this.resizeCanvas();
		stage.update();

		_this = this;
	}

	Canvas.prototype.resizeCanvas = function() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight/1.35;
		stage.width = window.innerWidth;
		stage.height = window.innerHeight/1.35;
		_tool.stroke = ((window.innerWidth + window.innerHeight) / 2)/100;
		stage.update();
	};

	Canvas.prototype.getTool = function() {
		return this.tool;
	}

	Canvas.prototype.setTool = function(tool) {
		console.log(_this.tool);
		_this.tool = tool;
	}

	return Canvas;

})();
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
var Tool = (function() {

	var	index = null,
		_this = null;

	// Constructor
	function Tool(drawingCanvas, stage) {
		index = 0;
		this.drawingCanvas = drawingCanvas;
		this.stage = stage;
		this.oldPt = null;
		this.oldMidPt = null;
		this.color = "#000000";
		this.colors = ["#828b20", "#b0ac31", "#cbc53d", "#fad779", "#f9e4ad", "#faf2db", "#563512", "#9b4a0b", "#d36600", "#fe8a00", "#f9a71f"];
		this.stroke = ((window.innerWidth + window.innerHeight) / 2)/100;
		this.stage.addEventListener("stagemousedown", this.handleMouseDown);
		this.stage.addEventListener("stagemouseup", this.handleMouseUp);

		_this = this;
	}

	Tool.prototype.stop = function() {

	};

	Tool.prototype.getStage = function() {
		return _this.stage;
	};

	Tool.prototype.setTool = function(tool) {
		_this = tool;
	}

	Tool.prototype.handleMouseDown = function(event) {
		// _this.color = _this.colors[(index++) % _this.colors.length];
		// _this.stroke = Math.random() * 30 + 10 | 0;
		
		_this.oldPt = new createjs.Point(_this.stage.mouseX, _this.stage.mouseY);
		_this.oldMidPt = _this.oldPt;
		_this.stage.addEventListener("stagemousemove", _this.handleMouseMove);
	}

	Tool.prototype.handleMouseMove = function(event) {
		var midPt = new createjs.Point(_this.oldPt.x + _this.stage.mouseX >> 1, _this.oldPt.y + _this.stage.mouseY >> 1);

		_this.drawingCanvas.graphics.clear().setStrokeStyle(_this.stroke, 'round', 'round').beginStroke(_this.color).moveTo(midPt.x, midPt.y).curveTo(_this.oldPt.x, _this.oldPt.y, _this.oldMidPt.x, _this.oldMidPt.y);

		_this.oldPt.x = _this.stage.mouseX;
		_this.oldPt.y = _this.stage.mouseY;

		_this.oldMidPt.x = midPt.x;
		_this.oldMidPt.y = midPt.y;

		_this.stage.update();
	}

	Tool.prototype.handleMouseUp = function(event) {
		_this.stage.removeEventListener("stagemousemove", _this.handleMouseMove);
	}

	return Tool;

})();
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