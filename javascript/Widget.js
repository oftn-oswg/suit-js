suit.Widget = function() {
	suit.Object.call(this);
};

suit.Widget.prototype = suit.Object.inherit();
suit.Widget.prototype.name = "Widget";

// Default instance variables
suit.Widget.prototype.parent = null;
suit.Widget.prototype.screen = null;
suit.Widget.prototype.has_window = false;
suit.Widget.prototype.window = null;
suit.Widget.prototype.realized = false;

suit.Widget.prototype.set_allocation = function(allocation) {
	var window;

	suit.ensure(allocation, suit.Allocation);
	
	window = this.window;
	this.allocation = allocation;

	if (window) {
		window.move_resize (allocation);
	}

	return this;
};


suit.Widget.prototype.size_allocate = function(allocation) {
	suit.ensure(allocation, suit.Allocation);
	
	this.set_allocation(allocation);
	return this;
};


suit.Widget.prototype.get_allocation = function() {
	return this.allocation;
};


suit.Widget.prototype.get_has_window = function() {
	return this.has_window;
};


suit.Widget.prototype.set_has_window = function(has_window) {
	this.has_window = has_window;
};


suit.Widget.prototype.realize = function() {
	var window, allocation;

	if (this.has_window) {
		window = new suit.Window(this.get_parent_window());
		allocation = this.get_allocation();
		
		window.move_resize (allocation);
		
		this.window = window;
		this.realized = true;
	}

};


suit.Widget.prototype.unrealize = function() {
	var window = this.window;

	if (this.has_window && window) {
		window.destroy ();
	}
};


suit.Widget.prototype.draw = function(context) {};
suit.Widget.prototype.get_request_mode = function() {};
suit.Widget.prototype.get_preferred_width = function() {};
suit.Widget.prototype.get_preferred_height = function() {};
suit.Widget.prototype.get_preferred_width_for_height = function() {};
suit.Widget.prototype.get_preferred_height_for_width = function() {};


suit.Widget.prototype.get_parent_window = function() {
	var parent = this.parent;
	if (!parent) return null;
	return parent.window;
};


suit.Widget.prototype.queue_redraw = function() {
	if (this.parent) this.parent.queue_redraw();
	return this;
};


suit.Widget.prototype.queue_resize = function() {
	if (this.parent) { 
		this.parent.queue_resize();
	}
	return this;
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


suit.Widget.prototype.register_event = function(e) {

	var has_coords = e.type & (suit.Event.ButtonPress |
		suit.Event.ButtonRelease |
		suit.Event.ButtonDblPress |
		suit.Event.Scroll |
		suit.Event.Motion);
		
	var isown = true;
	if (has_coords) {
		e.x -= this.allocation.x;
		e.y -= this.allocation.y;
	}
	
	// First scan children
	if (this.children) {
	
		var child, ca;
		if (has_coords) {
			child = this.get_child_with_coords(e.x, e.y);
			if (child) {
				isown = child.register_event(e);
				e.x += child.allocation.x;
				e.y += child.allocation.y;
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
	suit.ensure(x, "number");
	suit.ensure(y, "number");
	
	if (!this.allocation) return false;
	x -= this.allocation.x;
	y -= this.allocation.y;
	return [x, y];
};


suit.Widget.prototype.get_absolute_coordinates = function(x, y) {
	suit.ensure(x, "number");
	suit.ensure(y, "number");
	
	if (!this.allocation) return false;
	x += this.allocation.x;
	y += this.allocation.y;
	return [x, y];
};
