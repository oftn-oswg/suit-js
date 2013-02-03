suit.Button = function SUITButton(text) {
	var label;

	suit.Bin.call(this);
	
	if (text) {
		suit.ensure(text, "string");
		
		label = new suit.Label(text);
		label.set_selectable (false);
		label.set_align ("center");
		label.set_valign ("middle");

		this.set_child (label);
	}
	
	this.style = {
		padding_top: 6,
		padding_bottom: 6,
		padding_left: 8,
		padding_right: 8
	};
};
suit.inherit (suit.Button, suit.Bin);

// Default instance variables
suit.Button.prototype.name = "Button";
suit.Button.prototype.pressed = false;
suit.Button.prototype.event_mask = suit.Event.ButtonPress;

suit.Button.prototype.draw = function(graphics) {
	suit.ensure(graphics, suit.Graphics);
	
	var a = this.allocation;
	var x, y, w, h;

	x = 2;
	y = 2;
	w = a.width - 4;
	h = a.height - 4;

	// TODO: Move this into a theme class
	graphics.set_shadow (0, 0, 5, "#000");
	graphics.rect(x, y, w, h);
		// Safari can't do shadows on shapes with gradients I guess
	graphics.set_shadow();

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
		graphics.create_linear_gradient (x, y, x, y+h, stops),
		"#575757");
	graphics.rect(x, y, w, h);
	
	graphics.set_stroke_style (1, "butt", "miter");
	graphics.path([
		[x,         y + h - 1],
		[x,         y],
		[x + w - 1, y],
		[x + w - 1, y + h - 1]
	]);

	graphics.set_fill_stroke ("#ffffff", "#0b0b0b");
	graphics.path([
		[x + w - 1, y + h - 1],
		[x,         y + h - 1]
	]);

	var child;

	child = this.child;

	if (child) {
		this.propagate_draw (child, graphics);
	}
};

suit.Button.prototype.realize = function(empty) {
	suit.Widget.prototype.realize.call(this, empty);

	this.window.set_selectable(false);
}

suit.Button.prototype.size_allocate = function(allocation) {
	var ca;

	suit.Widget.prototype.size_allocate.call(this, allocation);
	if (this.child) {
		ca = new suit.Allocation(
			this.style.padding_left,
			this.style.padding_top + this.pressed,
			allocation.width - this.style.padding_left - this.style.padding_right,
			allocation.height - this.style.padding_top - this.style.padding_bottom
		);
		//console.log('button', this.child.text, 'alocation '+ca, 'my alloc'+allocation);
		this.child.size_allocate(ca);
	}
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
