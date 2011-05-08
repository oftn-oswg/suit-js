suit.Label = function(text) {
	suit.Widget.call(this);
	this.valign = "top"; // top, middle, bottom
	this.layout = new suit.TextLayout();
	//this.layout.set_font("Droid Sans", 16);
	this.layout.set_font("Times New Roman", 16);
	if (text) {
		this.layout.set_text(text);
	}
};
suit.Label.prototype = suit.Widget.inherit();
suit.Label.prototype.name = "Label";

suit.Label.prototype.set_text = function(text) {
	this.layout.set_text(text);
	this.queue_redraw();
};

suit.Label.prototype.set_align = function(align) {
	this.layout.set_align (align);
	this.queue_redraw();
};

suit.Label.prototype.set_valign = function(valign) {
	this.valign = valign;
	this.queue_redraw();
};

suit.Label.prototype.set_line_height = function(line_height) {
	this.layout.set_line_height(line_height);
	this.queue_redraw();
};

suit.Label.prototype.draw = function(context) {

	var height, x, y;
	context.set_fill_stroke ("#000");

	switch (this.valign) {
	case "top":
		y = this.allocation.y; break;
	case "middle":
		height = this.layout.get_preferred_height();
		y = (this.allocation.y + (this.allocation.height/2) - (height/2) - 1) | 0;
		break;
	case "bottom":
		height = this.layout.get_preferred_height();
		y = this.allocation.y + this.allocation.height - height - 1;
		break;
	}

	switch (this.layout.align) {
	case "left":
		x = this.allocation.x; break;
	case "center":
		x = (this.allocation.x + this.allocation.width/2 - 1) | 0; break;
	case "right":
		x = this.allocation.x + this.allocation.width - 1;
	}

	this.layout.render(context, x, y);
};

suit.Label.prototype.set_allocation = function(allocation) {
	suit.Widget.prototype.set_allocation.call(this, allocation);
	this.layout.set_width(allocation.width);
};

suit.Label.prototype.get_request_mode = function() {
	return SizeRequestMode.HEIGHT_FOR_WIDTH; // TODO: Rotatable text labels
};

suit.Label.prototype.get_preferred_width = function() {
	var width = this.layout.get_preferred_width();
	return {
		mininum: width,
		natural: width
	};
};
suit.Label.prototype.get_preferred_height = function() {
	var height = this.layout.get_preferred_height();
	return {
		mininum: height,
		natural: height
	};
};
suit.Label.prototype.get_preferred_height_for_width = function(width) {
	var height = this.layout.get_preferred_height_for_width(width);
	return {
		mininum: height,
		natural: height
	};
};
suit.Label.prototype.get_preferred_width_for_height = function(height) {
	var width = this.layout.get_preferred_width_for_height(height);
	return {
		mininum: width,
		natural: width
	};
};
