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