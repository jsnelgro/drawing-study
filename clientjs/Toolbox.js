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