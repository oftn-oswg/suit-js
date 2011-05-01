var Bin = function() {
	Widget.call(this);
	this.child = null;
};
Bin.prototype = SUIT.construct_prototype(Widget);
Bin.prototype.set_child = function(widget) {
	this.child = widget;
	this.child.parent = this;
	this.child.context = this.context;
};
