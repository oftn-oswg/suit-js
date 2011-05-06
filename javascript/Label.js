var Label = function(text) {
	Widget.call(this);
	this.layout = new TextLayout();
	this.layout.set_font("Droid Sans", 16);
	if (text) {
		this.layout.set_text(text);
	}
};
Label.prototype = SUIT.construct_prototype(Widget);

Label.prototype.set_text = function(text) {
	this.layout.set_text(text);
};

Label.prototype.draw = function() {
	var context = this.context;
	context.set_fill_stroke ("#fff");
	this.layout.render(context.cc, this.allocation.x, this.allocation.y);
};

Label.prototype.set_allocation = function(allocation) {
	Widget.prototype.set_allocation.call(this, allocation);
	this.layout.set_width(allocation.width);
};

Label.prototype.get_preferred_size = function(orientation) {
	var m = 0, n;
	if (orientation === SUIT.HORIZONTAL) {
		for (var i = 0, len = this.word_sizes.length; i < len; i++) {
			var lm = Math.max.apply(null, this.word_sizes[i]);
			m = (lm > m) ? lm : m;
		}
		n = Math.max.apply(null, this.line_sizes);
		return new RequestedSize(m, n);
	} else {
		m = this.line_sizes.length * this.line_height;
		n = m;
		return new RequestedSize(m, n);
	}
};

Label.prototype.get_request_mode = function() {
	return SizeRequestMode.HEIGHT_FOR_WIDTH; // TODO: Rotatable text labels
};
Label.prototype.get_preferred_width = function() {
	return this.get_preferred_size (SUIT.HORIZONTAL);
};
Label.prototype.get_preferred_height = function() {
	return this.get_preferred_size (SUIT.VERTICAL);
};
Label.prototype.get_preferred_height_for_width = function(width) {
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
	return new RequestedSize(height, height);
};
Label.prototype.get_preferred_width_for_height = function(height) {
	return this.get_preferred_size (SUIT.HORIZONTAL);
};

