suit.Scroller = function(child) {
	suit.Bin.call(this);
	
	this.scrollY = 0; // Distance from top of child to top of scroller. <= 0
	
	this.event_mask =
		suit.Event.ButtonPress | suit.Event.ButtonRelease | suit.Event.Scroll | suit.Event.Motion;
	
	this.dragging = false;
	this.startDragX = null;
	this.startDragY = null;
	
	if (child) {
		this.set_child(child);
	}
	this.connect("add", this.on_event_add);
	this.connect("event_button", this.on_event_button);
	this.connect("event_scroll", this.on_event_scroll);
	this.connect("event_motion", this.on_event_motion);

	this.style = {
		padding_top: 10,
		padding_bottom: 10,
		padding_left: 10,
		padding_right: 10
	};
};
suit.Scroller.prototype = suit.Bin.inherit();

suit.Scroller.prototype.draw = function(context) {
	var a = this.allocation;
	
	context.set_fill_stroke ("#000");
	context.rect(a.x, a.y, a.width, a.height);
	
	context.clip(a.x, a.y, a.width, a.height);
	this.child.draw(context);
};

suit.Scroller.prototype.set_allocation = function(allocation) {
	suit.Widget.prototype.set_allocation.call(this, allocation);
	this.update_child_position();
};

suit.Scroller.prototype.on_event_add = function(widget) {
	if (this.allocation) {
		this.update_child_position();
	}
};

suit.Scroller.prototype.update_child_position = function() {
	this.scrollY = this.scrollY > 0 ? 0 : this.scrollY;
	if (this.child) {
		var allocation = new suit.Allocation(
			this.allocation.x,
			this.allocation.y + this.scrollY,
			this.allocation.width,
			this.allocation.height
		);
		this.child.set_allocation(allocation);
		this.queue_redraw();
	}
};

suit.Scroller.prototype.on_event_scroll = function(e) {
	if (e.deltaY) {
		this.scrollY += e.deltaY;
		this.update_child_position();
	}
};

suit.Scroller.prototype.on_event_button = function(e) {
	switch (e.type) {
	case suit.Event.ButtonPress:
		this.startDragX = e.x;
		this.startDragY = e.y;
		this.dragging = true;
		this.lock();
		break;
	case suit.Event.ButtonRelease:
		if (this.dragging) {
			this.dragging = false;
			this.unlock();
		}
	}
};

suit.Scroller.prototype.on_event_motion = function(e) {
	if (this.dragging) {
		this.scrollY -= this.startDragY - e.y;
		this.startDragY = e.y;
		this.update_child_position();
	}
};

suit.Scroller.prototype.get_request_mode = function() {
	if (this.child) {
		return this.child.get_request_mode ();
	}
	return SizeRequestMode.HEIGHT_FOR_WIDTH;
};
suit.Scroller.prototype.get_preferred_width = function() {
	var preferred = new RequestedSize(1, 1);
	if (this.child) {
		preferred = this.child.get_preferred_width();
	}
	return preferred;
};
suit.Scroller.prototype.get_preferred_height = function() {
	var preferred = new suit.RequestedSize(1, 1);
	if (this.child) {
		preferred = this.child.get_preferred_height();
	}
	return preferred;
};
suit.Scroller.prototype.get_preferred_width_for_height = function(height) {
	var preferred = new suit.RequestedSize(1, 1);
	if (this.child) {
		preferred = this.child.get_preferred_width_for_height();
	}
	return preferred;
};
suit.Scroller.prototype.get_preferred_height_for_width = function(width) {
	var preferred = new suit.RequestedSize(1, 1);
	if (this.child) {
		preferred = this.child.get_preferred_height_for_width(width);
	}
	return preferred;
};
