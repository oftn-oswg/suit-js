suit.Button = function(text) {
	suit.Bin.call(this);
	
	this.event_mask = suit.Event.ButtonPress;
	
	this.pressed = false;
	if (text) {
		this.set_child(new suit.Label(text));
		this.child.set_align ("center");
		this.child.set_valign ("middle");
	}
	this.connect("event_button", this.on_event_button);

	this.style = {
		padding_top: 6,
		padding_bottom: 6,
		padding_left: 8,
		padding_right: 8
	};
};
suit.Button.prototype = suit.Bin.inherit();
suit.Button.prototype.name = "Button";

suit.Button.prototype.draw = function(context) {
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

	context.set_fill_stroke (
		context.create_linear_gradient (a.x, a.y, a.x, a.y+a.height, stops),
		"#575757");
	context.rect(a.x, a.y, a.width, a.height);
	
	context.set_stroke_style (1, "butt", "miter");
	context.path([
		[a.x,           a.y + a.height - 1],
		[a.x,           a.y],
		[a.x + a.width - 1, a.y],
		[a.x + a.width - 1, a.y + a.height - 1]
	]);

	context.set_fill_stroke ("#ffffff", "#0b0b0b");
	context.path([
		[a.x + a.width - 1, a.y + a.height - 1],
		[a.x,           a.y + a.height - 1]
	]);

	// Demonstration purposes
	//context.set_shadow (1, 1, 1, "black");
	//this.child.draw(context);
	//context.set_font_style ("16px \"Droid Sans\", Cabin, sans-serif", "center", "middle");
	//var top = a.y+((a.height-1)/2);
	//context.text("Droid Sans", (a.x + (a.width-1)/2) |0, top+(this.pressed?1:0));
	//context.set_shadow ();
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
};

suit.Button.prototype.on_event_button = function(e) {
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
