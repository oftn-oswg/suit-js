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


Widget.prototype.queue_redraw = function() {
	if (this.parent) this.parent.queue_redraw();
};
