var SizeRequestMode = {
	HEIGHT_FOR_WIDTH: 1,
	WIDTH_FOR_HEIGHT: 2
};

var RequestedSize = function(minimum, natural) {
	this.minimum = minimum;
	this.natural = natural;
};

var Widget = function() {
	BaseObject.call(this);
	this.parent = null;
};
Widget.prototype = SUIT.construct_prototype(BaseObject);
Widget.prototype.set_allocation = function(allocation) {
	this.allocation = allocation;
};
Widget.prototype.draw = function(context) {};
Widget.prototype.get_request_mode = function() {};
Widget.prototype.get_preferred_width = function() {};
Widget.prototype.get_preferred_height = function() {};
Widget.prototype.get_preferred_width_for_height = function() {};
Widget.prototype.get_preferred_height_for_width = function() {};


Widget.prototype.invalidate = function() {
	if (this.parent) this.parent.invalidate();
};

/*var Widget = function() {
	BaseObject.call(this);

	this.is_mapped = false;
	this.is_realized = false;
	this.is_sensitive = true;
};

Widget.prototype = Object.constructPrototype(BaseObject);

Widget.prototype.destroy = function() {
	this.unrealize();
};

Widget.prototype.show = function() {
};

Widget.prototype.showAll = function() {
};

Widget.prototype.hide = function() {
};

Widget.prototype.hideAll = function() {
};

Widget.prototype.realize = function() {
	this.is_realized = true;
};

Widget.prototype.unrealize = function() {
	if( this.is_realized ) {
		this.unmap();
		delete this.base;
		return true;
	}
	return false;
};

Widget.prototype.map = function(ele) {
	this.root = ele;
	this.is_mapped = true;
	if( this.base ) {
		this.root.appendChild(this.base);
		return true;
	}
	return false;
};

Widget.prototype.unmap = function() {
	if( this.base && this.root ) {
		this.is_mapped = false;
		this.root.removeChild(this.base);
		delete this.root;
		return true;
	}
	return false;
};

Widget.prototype.setSensitive = function(sensitive) {
	this.is_sensitive = sensitive;
};

Widget.prototype.getSensitive = function() {
	return this.is_sensitive;
};

Widget.prototype.setTooltip = function(tooltip) {
	this.root.title = tooltip;
};

Widget.prototype.setAllocation = function(allocation) {
	this.has_allocation = true;
	this.allocation = allocation;
	if( this.is_realized ) {
		this.base.style.position = 'absolute';
		this.base.style.top = allocation.y+'px';
		this.base.style.left = allocation.x+'px';
		this.base.style.width = allocation.width ? allocation.width+'px' : 'auto';
		this.base.style.height = allocation.height ? allocation.height+'px' : 'auto';
	}
};

Widget.prototype.getWidth = function() {
	if( this.is_realized )
		return parseInt(window.getComputedStyle(this.base, null).getPropertyValue("width"));
};
Widget.prototype.getHeight = function() {
	if( this.is_realized )
		return parseInt(window.getComputedStyle(this.base, null).getPropertyValue("height"));
};*/
