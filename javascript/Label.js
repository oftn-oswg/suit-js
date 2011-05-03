var Label = function(text) {
	Widget.call(this);
	//this.set_text(text);
	this.align = "left";
	
	this.line_height = 16;
	
	this.line_sizes = [0];
	this.word_sizes = [[0]];
	this.space_width = 0;
	this.calculated = false;
};
Label.prototype = SUIT.construct_prototype(Widget);

Label.prototype.set_text = function(text) {
	this.text = text;
	this.recalculate_layout();
	this.invalidate();
};

Label.prototype.recalculate_layout = function() {
	this.context.set_font_style ("16px Cabin, sans-serif", "left", "top");
	
	var line_split = this.text.split("\n"); // TODO: Regex
	var number_of_lines = line_split.length;
	
	var line_sizes = new Array(number_of_lines);
	var word_sizes = new Array(number_of_lines);
	for (var i = 0; i < number_of_lines; i++) {
		line_sizes[i] = this.context.text_width(line_split[i]);
		
		var word_split = line_split[i].split(" "); // TODO: Regex
		var number_of_words = word_split.length;
		
		word_sizes[i] = new Array(number_of_words);
		for (var j = 0; j < number_of_words; j++) {
			word_sizes[i][j] = this.context.text_width(word_split[j]);
		}
	}
	
	this.line_split = line_split;
	this.line_sizes = line_sizes;
	this.word_sizes = word_sizes;
	this.space_width = this.context.text_width(" ");
	this.calculated = true;
};

Label.prototype.draw = function() {
	var context = this.context;
	
	context.set_font_style ("16px Cabin, sans-serif", "left", "top");
	context.set_fill_stroke ("#fff");
	
	var width = this.allocation.width;
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
	
	
	context.text (this.text, this.allocation.x, this.allocation.y);
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

