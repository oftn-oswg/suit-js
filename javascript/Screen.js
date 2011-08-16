suit.Screen = function SUITScreen(root) {
	suit.Bin.call(this);
	this.root = root;
};

suit.Screen.inherit (suit.Bin);

suit.Screen.prototype.name = "Screen";
suit.Screen.prototype.root = null;

suit.Screen.prototype.draw = function(graphics) {
	var a = this.allocation;
	
	graphics.save();
	graphics.set_fill_stroke ("#191919");
	graphics.rect (0, 0, a.width, a.height);
	if (this.child) {
		this.propagate_draw (this.child, graphics);
	}
	graphics.restore();
};

suit.Screen.prototype.queue_resize = function() {
	var allocation;

	allocation = this.allocation;

	if (allocation) {
		this.size_allocate (allocation);
	}
};

suit.Screen.prototype.size_allocate = function(a) {
	suit.ensure(a, suit.Allocation);
	
	suit.Widget.prototype.size_allocate.call(this, a);

	if (this.child) {
		this.child.size_allocate (new suit.Allocation(10, 10, a.width - 20, a.height - 20));
	}
};

suit.Screen.prototype.get_parent_window = function() {
	return this.root;
};

