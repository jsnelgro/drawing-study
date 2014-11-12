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