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