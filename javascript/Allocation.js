suit.Allocation = (function() {

	/**
	 * An Allocation is simply a rectable which represents
	 * the bounds of a widget.
	 *
	 * @constructor
	 **/
	function SUITAllocation(x, y, width, height) {
		suit.ensure(x, "number");
		suit.ensure(y, "number");
		suit.ensure(width, "number");
		suit.ensure(height, "number");

		this.x = x | 0;
		this.y = y | 0;
		this.width = width > 1 ? width | 0 : 1;
		this.height = height > 1 ? height | 0 : 1;
	};

	/**
	* Returns an array representing the allocation's arguments.
	*
	* @return {Array.<number>} arguments
	**/
	SUITAllocation.prototype.args = function() {
		return [this.x, this.y, this.width, this.height];
	};

	/**
	* Returns some string representation of the allocation.
	* e.g. "(10, 10) 1024x600"
	*
	* @return {string} representation
	**/
	SUITAllocation.prototype.valueOf =
	SUITAllocation.prototype.toString = function() {
		var a = this;
		return "("+a.x+", "+a.y+") "+a.width+"x"+a.height;
	};

	/**
	* Creates a new allocation identical to the instance's.
	* @return {SUITAllocation}
	**/
	SUITAllocation.prototype.copy = function() {
		return new SUITAllocation(this.x, this.y, this.width, this.height);
	};

	/**
	* Creates a new allocation identical to the instance's,
	* except with an optional inset.
	*
	* @return {SUITAllocation}
	**/
	SUITAllocation.prototype.copy_shrink = function(inset) {
		return new SUITAllocation(this.x + inset, this.y + inset, this.width - (inset<<1), this.height - (inset<<1));
	};

	return SUITAllocation;
}());