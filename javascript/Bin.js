suit.Bin = function() {
	suit.Container.call(this);
	this.child = null;
};

suit.Bin.prototype = suit.Container.inherit();
suit.Bin.prototype.name = "Bin";

suit.Bin.prototype.set_child = function(widget) {

	if (!this.child) {
		this.child = widget;
		suit.Container.prototype.add.call(this, widget);
	} else {
		suit.error("#%s already has child widget #%s.", this.name, this.child.name);
	}
};

suit.Bin.prototype.get_child = function() {
	if (this.child) return this.child;
	return false;
};

suit.Bin.prototype.clear_child = function() {
	this.child = null;
	this.remove_all();
};

suit.Bin.prototype.add = function() {
	suit.error("#%s is a Bin widget and can only hold one child, use set_child to add a child.", this.name);
	return false;
};

suit.Bin.prototype.remove = function() {
	suit.error("#%s is a Bin widget; use clear_child to remove its child.", this.name);
	return false;
};
