var Canvas = (function() {

	var canvas, stage;
	var drawingCanvas;
	var _tool;
	var _this;
	var _resize = true;

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
		_resize = false;
		stage.update();

		_this = this;
	}

	Canvas.prototype.resizeCanvas = function() {
		if (_resize) {
			var height = window.innerHeight/1.35;
			var width = height%window.innerWidth;
			canvas.width = width;
			canvas.height = height;
			stage.width = width;
			stage.height = height;
			_tool.stroke = height / 100;
			stage.update();
		}
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
var Listeners = (function() {

	var _this;
	var _timer = 0;
	var _times_cleared = 0;
	var _images = {};
	var _canvas = document.getElementById('my-canvas');

	function Listeners() {
		_this = this;

		//when study is completed and submit button is clicked
		$('#my-form').submit(function(event) {
			event.preventDefault();
			// collect the data
			var data = JSON.parse(JSON.stringify($(this).serializeObject())); // uggghhhh god I hate html forms. I shouldn't have even bothered with them.
			data.imgs = _images;
			
			// send the data
			$.ajax({
				url: '/data',
				cache: false,
				type: 'POST',
				headers: {
					"cache-control": "no-cache"
				},
				data: data,
				success: function(res) {
					console.log("success:", res);
					//say thanks
					$('#myModalLabel').text('Thank You');
					$('#modal-body-id').text('Thank you for your participation! If you would like to learn more, you can email john_snelgrove@brown.edu. You may now close the page to finish the study.');
					// $('#submit-btn').attr('disabled', 'disabled');
					$('#modal-continue-btn').hide();
				},
				error: function(res) {
					$('#myModalLabel').text('Uh oh');
					$('#modal-body-id').text('Something went wrong submitting your data. Please try again using a different browser (there is a known problem with chrome for iOS), or contact john_snelgrove@brown.edu to report the issue.');
					$('#modal-continue-btn').hide();
					console.log("error: ", res);
				}
			});
		});

		//plays the current audio clip
		var p = document.getElementById('audio-player');
		$('.audio-play-btn').click(function(event) {
			if (p.paused) {
				p.play();
			}
		});

		//starts the timer when the test starts and ends it when the drawing is finished
		$('.start-stop-timer').click(function(event) {
			if (_timer === 0) {
				_timer = $.now();
			}
		});

		//click listener for moving to the next word and saving data
		var words = $('.meta-word');
		var word_i = 0;
		$('#audio-player source').attr('src', './word_clips/' + words[word_i].content + '.mp3');
		document.getElementById('audio-player').load();
		$('.next-word').click(function(event) {
			// save img and vars
			var img = _canvas.toDataURL();
			var curr_word = words[word_i].content.toString();
			_images[curr_word] = {};
			_images[curr_word].img = img;
			_images[curr_word].duration = $.now() - _timer;
			_images[curr_word].times_cleared = _times_cleared;

			//now clear the canvas and reset the vars
			var canvas = document.getElementById('my-canvas');
			var context = canvas.getContext('2d');
			context.clearRect(0, 0, canvas.width, canvas.height);
			_timer = $.now();
			_times_cleared = 0;

			word_i += 1;
			if (word_i == words.length - 1) {
				$(this).text('finish');
				$('#audio-player source').attr('src', './word_clips/' + words[word_i].content + '.mp3');
				document.getElementById('audio-player').load();
				if (p.paused) {
					p.play();
				}
			} else if (word_i == words.length) {
				$('.finished-btn').attr('disabled', 'disabled');
				$("#test-area").collapse();
			} else {
				$('#audio-player source').attr('src', './word_clips/' + words[word_i].content + '.mp3');
				document.getElementById('audio-player').load();
				if (p.paused) {
					p.play();
				}
			}
		});

		//clears whatever is on the canvas
		$('#clear-btn').click(function(event) {
			var retVal = confirm("Are you sure you want to clear your drawing?");
			if (retVal == true) {
				var canvas = document.getElementById('my-canvas');
				var context = canvas.getContext('2d');
				context.clearRect(0, 0, canvas.width, canvas.height);
				_times_cleared += 1;
				return true;
			} else {
				return false;
			}
		});

		// hides the drawing area when the questionaire appears
		$("#test-area").on("shown.bs.collapse", function(e) {
			$('#drawing-div').slideUp('slow/400/fast', function() {});
		});

		window.addEventListener('orientationchange', _this.orientationChange);

	}

	Listeners.prototype.orientationChange = function() {
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

	return Listeners;

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