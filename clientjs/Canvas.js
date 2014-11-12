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