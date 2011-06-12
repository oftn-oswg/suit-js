suit.Allocation = function(x, y, width, height) {
	suit.ensure(x, "number");
	suit.ensure(y, "number");
	suit.ensure(width, "number");
	suit.ensure(height, "number");

	this.x = x | 0;
	this.y = y | 0;
	this.width = width > 1 ? width | 0 : 1;
	this.height = height > 1 ? height | 0 : 1;
};

suit.Allocation.prototype.args = function() {
	return [this.x, this.y, this.width, this.height];
};
