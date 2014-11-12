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