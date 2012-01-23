suit.Widget = function SUITWidget() {
	suit.Object.call(this);
};

suit.inherit (suit.Widget, suit.Object);

// Default instance variables
suit.Widget.prototype.name = "Widget";
suit.Widget.prototype.parent = null;
suit.Widget.prototype.screen = null;
suit.Widget.prototype.has_window = false;
suit.Widget.prototype.window = null;
suit.Widget.prototype.realized = false;
suit.Widget.prototype.event = null;
suit.Widget.prototype.event_mask = suit.Event.None;


suit.Widget.prototype.show = function() {
	if (!this.realized) {
		this.realize ();
	}
};
suit.Widget.prototype.show_all = suit.Widget.prototype.show;


suit.Widget.prototype.set_allocation = function(allocation) {
	var window;

	suit.ensure(allocation, suit.Allocation);
	this.allocation = allocation;

	window = this.window;

	if (window) {
		window.move_resize (allocation);
	}
};


suit.Widget.prototype.size_allocate = suit.Widget.prototype.set_allocation;

suit.Widget.prototype.get_allocation = function() {
	return this.allocation;
};


suit.Widget.prototype.get_has_window = function() {
	return this.has_window;
};


suit.Widget.prototype.set_has_window = function(has_window) {
	this.has_window = has_window;
};


suit.Widget.prototype.realize = function(empty) {
	var window, allocation;

	if (this.has_window && !this.realized) {

		allocation = this.allocation;

		if (allocation) {
			this.size_allocate (allocation);
		}

		window = new suit.Window(this.get_parent_window(), this, empty);
		window.move_resize (allocation);

		this.window = window;
	}

	this.realized = true;

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

suit.Widget.prototype.get_parent = function() {
	return this.parent;
};

suit.Widget.prototype.get_parent_window = function() {
	var parent = this.parent;
	if (!parent) return null;
	return parent.window || parent.get_parent_window();
};


suit.Widget.prototype.queue_redraw = function() {
	var allocation;

	allocation = this.allocation;

	if (this.realized) {
		if (this.has_window) {
			this.window.invalidate ();
		} else if (this.parent) {
			this.parent.queue_redraw_area (allocation.x, allocation.y, allocation.width, allocation.height);
		}
	}
};


suit.Widget.prototype.queue_redraw_area = function(x, y, width, height) {
	suit.ensure (x, "number");
	suit.ensure (y, "number");
	suit.ensure (width, "number");
	suit.ensure (height, "number");

	if (this.realized) {
		if (this.has_window) {
			this.window.invalidate_area (x, y, width, height);
		} else if (this.parent) {
			this.parent.queue_redraw_area (x, y, width, height); // TODO: Translate coordinates
		}
	}
};


suit.Widget.prototype.queue_resize = function() {
	if (this.parent) {
		this.parent.queue_resize();
	}
	if (this.window) {
		this.window.invalidate ();
	}
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
	suit.ensure(bits, "number");
	
	this.event_mask |= bits;
	return this;
};


suit.Widget.prototype.event_mask_sub = function(bits) {
	suit.ensure(bits, "number");
	
	this.event_mask ^= bits;
	return this;
};


suit.Widget.prototype.lock = function() {
	if (suit.lock && suit.lock !== this) {
		suit.error("Events are already locked by another window.");
		return false;
	}
	suit.lock = this;
	return true;
};


suit.Widget.prototype.unlock = function() {
	suit.lock = null;
};
