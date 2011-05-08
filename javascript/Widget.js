suit.Widget = function() {
	suit.Object.call(this);
	this.parent = null;
	this.screen = null;
	this.event_mask = suit.Event.None;
};
suit.Widget.prototype = suit.Object.inherit();
suit.Widget.prototype.name = "Widget";

suit.Widget.prototype.set_allocation = function(allocation) {
	this.allocation = allocation;
};
suit.Widget.prototype.get_allocation = function() {
	return this.allocation;
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
suit.Widget.prototype.queue_resize = function() {
	if (this.parent) this.parent.queue_resize();
};

suit.Widget.prototype.get_screen = function() {
	if (this.screen) return this.screen;
	var widget = this;
	while (widget.parent) {
		if (widget.parent instanceof suit.Screen) return widget.parent;
		widget = widget.parent;
	}
	return null;
};

suit.Widget.prototype.event_mask_add = function(bits) {
	this.event_mask |= bits;
};

suit.Widget.prototype.event_mask_sub = function(bits) {
	this.event_mask ^= bits;
};

suit.Widget.prototype.lock = function() {
	var screen = this.get_screen();
	if (screen.lock && screen.lock !== this) {
		suit.error("Events are already locked by another widget.");
	}
	screen.lock = this;
};

suit.Widget.prototype.unlock = function() {
	this.get_screen().lock = null;
};

suit.Widget.prototype.register_event = function(e) {
	// First check if the event mask includes the event
	if (this.event_mask & e.type) {
		this.emit(e.name, e);
	}
};

suit.SizeRequestMode = {
	HEIGHT_FOR_WIDTH: 1,
	WIDTH_FOR_HEIGHT: 2
};

suit.RequestedSize = function(minimum, natural) {
	this.minimum = minimum;
	this.natural = natural;
};

