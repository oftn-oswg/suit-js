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
		height = this.layout.get_apparent_height();
		y = (this.allocation.y + (this.allocation.height/2) - (height/2) - 1) | 0;
		break;
	case "bottom":
		height = this.layout.get_apparent_height();
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

	this.layout.render(context.cc, x, y);
};

suit.Label.prototype.set_allocation = function(allocation) {
	suit.Widget.prototype.set_allocation.call(this, allocation);
	this.layout.set_width(allocation.width);
};

suit.Label.prototype.get_preferred_size = function(orientation) {
	var m = 0, n;
	if (orientation === SUIT.HORIZONTAL) {
		for (var i = 0, len = this.word_sizes.length; i < len; i++) {
			var lm = Math.max.apply(null, this.word_sizes[i]);
			m = (lm > m) ? lm : m;
		}
		n = Math.max.apply(null, this.line_sizes);
		return new suit.RequestedSize(m, n);
	} else {
		m = this.line_sizes.length * this.line_height;
		n = m;
		return new suit.RequestedSize(m, n);
	}
};

suit.Label.prototype.get_request_mode = function() {
	return SizeRequestMode.HEIGHT_FOR_WIDTH; // TODO: Rotatable text labels
};
suit.Label.prototype.get_preferred_width = function() {
	return this.get_preferred_size (SUIT.HORIZONTAL);
};
suit.Label.prototype.get_preferred_height = function() {
	return this.get_preferred_size (SUIT.VERTICAL);
};
suit.Label.prototype.get_preferred_height_for_width = function(width) {
	var space_left = width;
	var word_width;
	var number_of_lines = 0;
	for (var i = 0, len = this.word_sizes.length; i < len; i++) {
		number_of_lines++;
		for (var j = 0, jlen = this.word_sizes[i].length; j < jlen; j++) {
			word_width = this.word_sizes[i][j];
			if (word_width + this.space_width > space_left) {
				number_of_lines++;
				space_left = width - word_width;
			} else {
				space_left -= word_width + this.space_width;
			}
		}
	}
	var height = number_of_lines * this.line_height;
	return new suit.RequestedSize(height, height);
};
suit.Label.prototype.get_preferred_width_for_height = function(height) {
	return this.get_preferred_size (SUIT.HORIZONTAL);
};
