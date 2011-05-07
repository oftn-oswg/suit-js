suit.Widget = function() {
	suit.Object.call(this);
	this.parent = null;
};
suit.Widget.prototype = suit.Object.inherit();
suit.Widget.prototype.set_allocation = function(allocation) {
	this.allocation = allocation;
};
suit.Widget.prototype.draw = function(context) {};
suit.Widget.prototype.get_request_mode = function() {};
suit.Widget.prototype.get_preferred_width = function() {};
suit.Widget.prototype.get_preferred_height = function() {};
suit.Widget.prototype.get_preferred_width_for_height = function() {};
suit.Widget.prototype.get_preferred_height_for_width = function() {};


suit.Widget.prototype.queue_redraw = function() {
	if (this.parent) this.parent.queue_redraw();
};

suit.SizeRequestMode = {
	HEIGHT_FOR_WIDTH: 1,
	WIDTH_FOR_HEIGHT: 2
};

suit.RequestedSize = function(minimum, natural) {
	this.minimum = minimum;
	this.natural = natural;
};

