suit.Button = function SUITButton(text) {
	suit.Bin.call(this);
	
	if (text) {
		suit.ensure(text, "string");
		
		this.set_child(new suit.Label(text));
		this.child.set_align ("center");
		this.child.set_valign ("middle");
	}
	
	this.style = {
		padding_top: 6,
		padding_bottom: 6,
		padding_left: 8,
		padding_right: 8
	};
};
suit.Button.inherit (suit.Bin);

// Default instance variables
suit.Button.prototype.name = "Button";
suit.Button.prototype.pressed = false;
suit.Button.prototype.event_mask = suit.Event.ButtonPress;

suit.Button.prototype.draw = function(graphics) {
	suit.ensure(graphics, suit.Graphics);
	
	var a = this.allocation;

	// TODO: Move this into a theme class
	/*context.set_shadow (0, 0, 5, "#000");
	context.rect(a.x, a.y, a.width, a.height);
		// Safari can't do shadows on shapes with gradients I guess
	context.set_shadow();*/

	var stops;
	if (!this.pressed) {
		stops = [
			[0, "#3f3f3f"],
			[1, "#2e2e2e"]
		];
	} else {
		stops = [
			[0, "#2e2e2e"],
			[1, "#3f3f3f"]
		];
	}

	graphics.set_fill_stroke (
		graphics.create_linear_gradient (0, 0, 0, a.height, stops),
		"#575757");
	graphics.rect(0, 0, a.width, a.height);
	
	graphics.set_stroke_style (1, "butt", "miter");
	graphics.path([
		[0,           a.height - 1],
		[0,           0],
		[a.width - 1, 0],
		[a.width - 1, a.height - 1]
	]);

	graphics.set_fill_stroke ("#ffffff", "#0b0b0b");
	graphics.path([
		[a.width - 1, a.height - 1],
		[0,           a.height - 1]
	]);

	var child;

	child = this.child;

	if (child) {
		this.propagate_draw (child, graphics);
	}
};

suit.Button.prototype.size_allocate = function(allocation) {
	suit.Widget.prototype.size_allocate.call(this, allocation);
	if (this.child) {
		this.child.size_allocate(new suit.Allocation(
			this.style.padding_left,
			this.style.padding_top + this.pressed,
			allocation.width - this.style.padding_left - this.style.padding_right - 1,
			allocation.height - this.style.padding_top - this.style.padding_bottom - 1
		));
	}
	return this;
};

suit.Button.prototype.event = function(e) {
	switch (e.type) {
	case suit.Event.ButtonPress:
		this.pressed = true;
		this.event_mask_add(suit.Event.ButtonRelease);
		this.lock();
		this.size_allocate(this.allocation);
		this.queue_redraw();
		break;
	case suit.Event.ButtonRelease:
		if (this.pressed) {
			this.event_mask_sub(suit.Event.ButtonRelease);
			this.emit("activate");
			this.pressed = false;
			this.unlock();
			this.size_allocate(this.allocation);
			this.queue_redraw();
		}
	}
};
