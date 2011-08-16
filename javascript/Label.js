suit.Label = function SUITLabel(text) {
	suit.Widget.call(this);
	
	this.layout = new suit.TextLayout();
	this.layout.set_font(["Droid Sans", "Segoe UI", "sans-serif"], 16);
	
	var self = this;
	this.layout.connect("resize", function() {
		self.queue_resize();
	});
	if (text) {
		suit.ensure(text, "string");
		this.layout.set_text(text);
	}
};

suit.Label.inherit (suit.Widget);

// Default instance variables
suit.Label.prototype.name = "Label";
suit.Label.prototype.valign = "top"; // top, middle, bottom

suit.Label.prototype.set_text = function(text) {
	suit.ensure(text, "string");
	
	this.layout.set_text(text);
	this.queue_redraw();
	return this;
};

suit.Label.prototype.set_align = function(align) {
	suit.ensure(align, "string");
	
	this.layout.set_align (align);
	this.queue_redraw();
	return this;
};

suit.Label.prototype.set_valign = function(valign) {
	suit.ensure(valign, "string");
	
	this.valign = valign;
	this.queue_redraw();
	return this;
};

suit.Label.prototype.set_line_height = function(line_height) {
	this.layout.set_line_height(line_height);
	this.queue_redraw();
	return this;
};

suit.Label.prototype.draw = function(graphics) {
	suit.ensure(graphics, suit.Graphics);

	var height, x, y;
	graphics.set_fill_stroke ("#fff");

	x = 0;
	y = 0;

	switch (this.valign) {
	case "middle":
		height = this.layout.get_preferred_height();
		y = (this.allocation.height/2) - (height/2) - 1 | 0;
		break;
	case "bottom":
		height = this.layout.get_preferred_height();
		y = this.allocation.height - height - 1;
		break;
	}

	switch (this.layout.align) {
	case "center":
		x = (this.allocation.width/2 - 1) | 0; break;
	case "right":
		x = this.allocation.width - 1;
	}

	this.layout.render(graphics, x, y);
	return this;
};

suit.Label.prototype.size_allocate = function(allocation) {
	suit.ensure(allocation, suit.Allocation);
	
	suit.Widget.prototype.size_allocate.call(this, allocation);
	this.layout.set_width(allocation.width);
	return this;
};

suit.Label.prototype.get_request_mode = function() {
	return SizeRequestMode.HEIGHT_FOR_WIDTH; // TODO: Rotatable text labels
};

suit.Label.prototype.get_preferred_width = function() {
	var width = this.layout.get_preferred_width();
	return {
		minimum: width,
		natural: width
	};
};
suit.Label.prototype.get_preferred_height = function() {
	var height = this.layout.get_preferred_height();
	return {
		minimum: height,
		natural: height
	};
};
suit.Label.prototype.get_preferred_height_for_width = function(width) {
	var height = this.layout.get_preferred_height_for_width(width);
	return {
		minimum: height,
		natural: height
	};
};
suit.Label.prototype.get_preferred_width_for_height = function(height) {
	var width = this.layout.get_preferred_width_for_height(height);
	return {
		minimum: width,
		natural: width
	};
};
