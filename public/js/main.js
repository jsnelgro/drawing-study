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
var CircleTool = (function () {

	var _self = null;

	// Constructor
	function CircleTool() {
		console.log('circletool created');

	}
	// CircleTool.prototype = new Tool();

	CircleTool.prototype.someMethod = function () {
	// take it away Mr. Public Method
	};

return CircleTool;

})();
var LineTool = (function () {

	var _someVar = null,
		_anotherVar = null;

	// Constructor
	function LineTool(x, y) {
		_someVar = x;
		_anotherVar = y;
	}

	LineTool.prototype.someMethod = function () {
	// take it away Mr. Public Method
	};

return LineTool;

})();
var SmoothLineTool = (function () {

	var _someVar = null,
		_anotherVar = null;

	// Constructor
	function SmoothLineTool() {
	}

	SmoothLineTool.prototype.someMethod = function () {
	// take it away Mr. Public Method
	};

	SmoothLineTool.prototype.setTool = function(tool) {
		_this = tool;
	}

	SmoothLineTool.prototype.handleMouseDown = function(event) {
		color = colors[(index++) % colors.length];
		stroke = Math.random() * 30 + 10 | 0;
		
		oldPt = new createjs.Point(stage.mouseX, stage.mouseY);
		oldMidPt = oldPt;
		stage.addEventListener("stagemousemove", _this.handleMouseMove);
	}

	SmoothLineTool.prototype.handleMouseMove = function(event) {
		var midPt = new createjs.Point(oldPt.x + stage.mouseX >> 1, oldPt.y + stage.mouseY >> 1);

		drawingCanvas.graphics.clear().setStrokeStyle(stroke, 'round', 'round').beginStroke(color).moveTo(midPt.x, midPt.y).curveTo(oldPt.x, oldPt.y, oldMidPt.x, oldMidPt.y);

		oldPt.x = stage.mouseX;
		oldPt.y = stage.mouseY;

		oldMidPt.x = midPt.x;
		oldMidPt.y = midPt.y;

		stage.update();
	}

	SmoothLineTool.prototype.handleMouseUp = function(event) {
		stage.removeEventListener("stagemousemove", _this.handleMouseMove);
	}

return SmoothLineTool;

})();
var SquareTool = (function () {

	var _this = null,
		_super = null;

	// Constructor
	function SquareTool(tool) {
		_super = tool;
		console.log('Squaretool created');
		SquareTool.prototype = tool;
		_super.stroke = 15;
		_super.stage.addEventListener("stagemousedown", this.handleMouseDown);


		_this = this;
	}

	SquareTool.prototype.handleMouseDown = function(event) {
		console.log('square DOWN');		
		_super.oldPt = new createjs.Point(_super.stage.mouseX, _super.stage.mouseY);
		_super.oldMidPt = _super.oldPt;
		_super.stage.addEventListener("stagemousemove", _super.handleMouseMove);
	}


	// SquareTool.prototype.handleMouseMove = function(event) {
	// 	var midPt = new createjs.Point(_super.oldPt.x + _super.stage.mouseX >> 1, _super.oldPt.y + _super.stage.mouseY >> 1);

	// 	_super.drawingCanvas.graphics.clear().setStrokeStyle(stroke, 'round', 'round').beginStroke(color).moveTo(midPt.x, midPt.y).curveTo(_super.oldPt.x, _super.oldPt.y, _super.oldMidPt.x, _super.oldMidPt.y);

	// 	_super.oldPt.x = _super.stage.mouseX;
	// 	_super.oldPt.y = _super.stage.mouseY;

	// 	_super.oldMidPt.x = midPt.x;
	// 	_super.oldMidPt.y = midPt.y;

	// 	stage.update();
	// }

	// SquareTool.prototype.handleMouseUp = function(event) {
	// 	_super.stage.removeEventListener("stagemousemove", _super.handleMouseMove);
	// }

return SquareTool;

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
var Toolbox = (function () {

	var _toolbox = null,
		_this,
		_tool = null,
		_currentTool = null,
		_canvas = null,
		_box = {
			'circle': null,
			'box': null,
			'smoothline': null,
			'line': null
		};

	// Constructor
	function Toolbox(toolbox_id, canvas) {
		_toolbox = document.getElementById(toolbox_id);
		_this = this;
		_canvas = canvas;
		_tool = canvas.getTool();
		_box['circle'] = CircleTool;
		_box['line'] = LineTool;
		_box['smoothline'] = SmoothLineTool;
		_box['square'] = SquareTool;


		var buttons = _toolbox.getElementsByTagName('button');
		for (var i = buttons.length - 1; i >= 0; i--) {
			var tool_name = buttons[i].id.replace('-btn','');
			// ugggghhhhh javascript..... need to wrap clicklistener in closure to stop it from overwriting the last listener
			(function(_tool_name){
				buttons[i].addEventListener('click', function() {
					console.log(_tool_name);
					_this.setCurrentTool(_tool_name);
				});
			})(tool_name);
		};

	}

	Toolbox.prototype.getCurrentTool = function() {
		return _currentTool;
	};

	Toolbox.prototype.setCurrentTool = function(tool) {
		_canvas.setTool(new _box[tool](_tool));
	};

return Toolbox;

})();
(function() {
	var canvas = new Canvas('my-canvas');
	// var toolbox = new Toolbox('my-toolbox', canvas);

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