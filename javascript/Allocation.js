suit.Allocation = function(x, y, width, height) {
	this.x = x | 0;
	this.y = y | 0;
	this.width = width > 1 ? width | 0 : 1;
	this.height = height > 1 ? height | 0 : 1;
};
