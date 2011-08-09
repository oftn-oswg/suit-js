suit.Scroller = function(child) {
	suit.Bin.call(this);
	
	this.scrollX = 0; // Distance from left of child to left of scroller. <= 0
	this.scrollY = 0; // Distance from top of child to top of scroller. <= 0
	
	this.dragging = false;
	this.startDragX = null;
	this.startDragY = null;
	
	this.policyX = "never"; // "never", "always"
	this.policyY = "always";
	
	if (child) {
		suit.ensure(child, suit.Widget);
		this.set_child(child);
	}

	this.style = {
		padding_top: 5,
		padding_bottom: 5,
		padding_left: 8,
		padding_right: 8
	};

	this.set_has_window (true);
};
suit.Scroller.prototype = suit.Bin.inherit();
suit.Scroller.prototype.name = "Scroller";


suit.Scroller.prototype.realize = function() {
	suit.Widget.prototype.realize.call(this);

	this.window.connect("event_button", this.on_event_button);
	this.window.connect("event_scroll", this.on_event_scroll);
	this.window.connect("event_motion", this.on_event_motion);
};


suit.Scroller.prototype.draw = function(context) {
	suit.ensure(context, suit.Graphics);
	
	var a = this.allocation;
	
	context.set_fill_stroke ("#000");
	context.rect(a.x, a.y, a.width, a.height);
	
	if (this.child) {
		this.draw_scrollbars(context);
	}
	return this;
};

suit.Scroller.prototype.draw_scrollbars = function(context) {
	suit.ensure(context, suit.Graphics);
	
	var a = this.allocation;
	var ca = this.child.get_allocation();
	
	context.set_stroke_style (4, "round");
	context.set_fill_stroke (null, "#333");
	
	if (this.policyY === "always") {
		var x = a.x + a.width - 5.5;
		var y = 6 + a.y + ((-this.scrollY) / ca.height * a.height);
		var h = a.height/ca.height*(a.height-12) - 12;
		context.path([
			[x, y],
			[x, y+h]
		]);
	}
	
	if (this.policyX === "always") {
		var y = a.y + a.height - 5.5;
		var x = 6 + a.x + ((-this.scrollX) / ca.width * a.width);
		var w = a.width/ca.width*(a.width-12) - 12;
		context.path([
			[x, y],
			[x+w, y]
		]);
	}
}

suit.Scroller.prototype.size_allocate = function(allocation) {
	suit.ensure(allocation, suit.Allocation);
	
	suit.Widget.prototype.size_allocate.call(this, allocation);
	
	var cw, ch;
	if (this.child) {
		if (this.policyX === "never" && this.policyY === "always") {
			cw = allocation.width - this.style.padding_left - this.style.padding_right - 1;
			ch = this.child.get_preferred_height_for_width(cw).natural;
		} else if (this.policyX === "never" && this.policyY === "never") {
			cw = allocation.width - this.style.padding_left - this.style.padding_right - 1;
			ch = allocation.height - this.style.padding_top - this.style.padding_bottom - 1;
		} else if (this.policyX === "always" && this.policyY === "always") {
			cw = this.child.get_preferred_width().natural;
			ch = this.child.get_preferred_height().natural;
		} else if (this.policyX === "always" && this.policyY === "never") {
			ch = allocation.height - this.style.padding_top - this.style.padding_bottom - 1;
			cw = this.child.get_preferred_width_for_height(ch).natural;
		}
		this.child.size_allocate(new suit.Allocation(0, 0, cw, ch));
		this.update_scroll_position();
	}
	return this;
};

suit.Scroller.prototype.update_scroll_position = function() {
	if (this.child) {
		var ca = this.child.get_allocation();
		var a = this.get_allocation();
		
		var max_scrollX = a.width - ca.width - this.style.padding_left - this.style.padding_right;
		var max_scrollY = a.height - ca.height - this.style.padding_bottom - this.style.padding_top;
		
		this.scrollX = this.scrollX > 0 ? 0 :
			(this.scrollX < max_scrollX ? max_scrollX : this.scrollX);
		this.scrollY = this.scrollY > 0 ? 0 :
			(this.scrollY < max_scrollY ? max_scrollY : this.scrollY);
		
		if (this.policyX === "never") this.scrollX = 0;
		if (this.policyY === "never") this.scrollY = 0;
		
		ca.x = this.style.padding_left + this.scrollX;
		ca.y = this.style.padding_top + this.scrollY;
		
		this.child.set_allocation(ca); // Use set_allocation here because we don't need to recalculate layout.
		this.queue_redraw();
	}
	return this;
};

suit.Scroller.prototype.set_policy = function(horizontal, vertical) {
	suit.ensure(horizontal, ["string", "undefined"]);
	suit.ensure(vertical, ["string", "undefined"]);
	
	this.policyX = horizontal || "never";
	this.policyY = vertical || "always";
	return this;
};

suit.Scroller.prototype.on_event_scroll = function(e) {
	if (e.deltaY && this.policyY === "always") {
		this.scrollY += e.deltaY;
		this.update_scroll_position();
	}
	if (e.deltaX && this.policyX === "always") {
		this.scrollX += e.deltaX;
		this.update_scroll_position();
	}
};

suit.Scroller.prototype.on_event_button = function(e) {
	switch (e.type) {
	case suit.Event.ButtonPress:
		this.startDragX = e.x;
		this.startDragY = e.y;
		this.dragging = true;
		this.event_mask_add (suit.Event.Motion);
		this.lock();
		break;
	case suit.Event.ButtonRelease:
		if (this.dragging) {
			this.dragging = false;
			this.event_mask_sub (suit.Event.Motion);
			this.unlock();
		}
	}
};

suit.Scroller.prototype.on_event_motion = function(e) {
	if (this.dragging) {
		if (this.policyY === "always") {
			this.scrollY -= this.startDragY - e.y;
			this.startDragY = e.y;
		}
		if (this.policyX === "always") {
			this.scrollX -= this.startDragX - e.x;
			this.startDragX = e.x;
		}
		this.update_scroll_position();
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
	suit.ensure(height, "number");
	
	var preferred = new suit.RequestedSize(1, 1);
	if (this.child) {
		preferred = this.child.get_preferred_width_for_height();
	}
	return preferred;
};
suit.Scroller.prototype.get_preferred_height_for_width = function(width) {
	suit.ensure(width, "number");
	
	var preferred = new suit.RequestedSize(1, 1);
	if (this.child) {
		preferred = this.child.get_preferred_height_for_width(width);
	}
	return preferred;
};
