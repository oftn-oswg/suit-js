suit.Container = function() {
	suit.Widget.call(this);
	this.children = [];
};

suit.Container.prototype = suit.Widget.inherit();

suit.Container.prototype.name = "Container";

suit.Container.prototype.add = function(widget) {
	this.children.push(widget);
	widget.parent = this;
	widget.screen = this.get_screen();

	this.emit('add');
	return true;
};

suit.Container.prototype.remove = function(widget) {
	var index;
	if( (index = this.children.indexOf(widget)) > -1 ) {
		this.children.splice(index, 1);
		return true;
	}
	return false;
};

suit.Container.prototype.remove_all = function() {
	for (var i = 0, len = this.children.length; i < len; i++) {
		this.children[i].parent = null;
		this.children[i].screen = null;
	}
	this.children = [];
};

suit.Container.prototype.get_child_with_coords = function(x, y) {
	if (!this.children.length) return false;
	
	var child;
	for (var i = 0, len = this.children.length; i < len; i++) {
		child = this.children[i];
		if (!child.allocation) continue;
		if (x >= child.allocation.x &&
			x <= child.allocation.x + child.allocation.width &&
			y >= child.allocation.y &&
			y <= child.allocation.y + child.allocation.height) {
				return child;
		}
	}
	return false;
};
