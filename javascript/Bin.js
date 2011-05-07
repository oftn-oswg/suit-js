suit.Bin = function() {
	suit.Widget.call(this);
	this.child = null;
};

suit.Bin.prototype = suit.Widget.inherit();

suit.Bin.prototype.set_child = function(widget) {

	if (!this.child) {
		this.child = widget;
		this.child.parent = this;
		this.child.context = this.context;

		this.emit('add');
	} else {
		throw new Error("Widget of type Bin already has child widget.");
	}
};
