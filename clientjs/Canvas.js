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