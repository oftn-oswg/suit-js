var Allocation = function(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width > 1 ? width : 1;
	this.height = height > 1 ? height : 1;
};
