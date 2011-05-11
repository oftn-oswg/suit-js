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
suit.Widget.prototype.size_allocate = function(allocation) {
	this.set_allocation(allocation);
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
		suit.error("Events are already locked by #%s.", screen.lock.name);
		return false;
	}
	screen.lock = this;
	return true;
};

suit.Widget.prototype.unlock = function() {
	this.get_screen().lock = null;
};

suit.Widget.prototype.register_event = function(e) {

	var coordinate_mask = suit.Event.ButtonPress |
		suit.Event.ButtonRelease |
		suit.Event.ButtonDblPress |
		suit.Event.Scroll |
		suit.Event.Motion;
		
	var isown = true;
	
	// First scan children
	if (this.children) {
	
		var child, ca;
		if (e.type & coordinate_mask) {
			child = this.get_child_with_coords(e.x, e.y);
			if (child) {
				isown = child.register_event(e);
			}
		}
	
	}
	
	if (isown) {
		// First check if the event mask includes the event
		if (this.event_mask & e.type) {
			this.emit(e.name, e);
			return false;
		}
		return true;
	}
	
	return false;
};

suit.Widget.prototype.get_local_coordinates = function(x, y) {
	if (!this.allocation) return false;
	x -= this.allocation.x;
	y -= this.allocation.y;
	return [x, y];
};

suit.Widget.prototype.get_absolute_coordinates = function(x, y) {
	if (!this.allocation) return false;
	x += this.allocation.x;
	y += this.allocation.y;
	return [x, y];
};
