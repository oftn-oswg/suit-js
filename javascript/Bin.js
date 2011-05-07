suit.Bin = function() {
	suit.Widget.call(this);
	this.child = null;
};

suit.Bin.prototype = suit.Widget.inherit();

suit.Bin.prototype.set_child = function(widget) {

	if (!this.child) {
		this.child = widget;
		this.child.parent = this;
		this.child.screen = this.get_screen();

		this.emit('add');
	} else {
		throw new Error("Widget of type Bin already has child widget.");
	}
};

suit.Bin.prototype.get_child_with_coords = function(x, y) {
	if (!this.child) return false;
	if (!this.child.allocation) return false;
	if (x >= this.child.allocation.x &&
		x <= this.child.allocation.x + this.child.allocation.width &&
		y >= this.child.allocation.y &&
		y <= this.child.allocation.y + this.child.allocation.height) {
			return this.child;
	}
	return false;
};
