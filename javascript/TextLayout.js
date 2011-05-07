suit.TextLayout = function() {
	this.text = "";
	this.text_wrapped = [""];
	
	this.font_name = null;
	this.font_size = null;
	this.line_height = null;
	
	this.align = "left";
	this.width = null; // Infinite
	this.calculated = true;
	
	this.apparent_width = null;
	this.apparent_height = null;
};

suit.TextLayout.canvas_context = (function() {
	var c = document.createElement('canvas');
	return c.getContext('2d');
})();

suit.TextLayout.prototype.text_width = function(string) {
	return suit.TextLayout.canvas_context.measureText(string).width;
};

suit.TextLayout.prototype.set_text = function (text) {
	this.text = text;
	this.calculated = false;
};

suit.TextLayout.prototype.set_font = function (font_name, font_size) {
	this.font_name = font_name;
	this.font_size = font_size;
	this.calculated = false;
};

suit.TextLayout.prototype.set_line_height = function (line_height) {
	this.line_height = line_height;
};

suit.TextLayout.prototype.set_align = function (align) {
	this.align = align;
};

suit.TextLayout.prototype.set_width = function (width) {
	this.width = width;
	this.calculated = false;
};

suit.TextLayout.prototype.get_css_font_string = function() {
	return this.font_size + "px \""+this.font_name+"\"";
};

// TODO: Implement this function
suit.TextLayout.prototype.get_index_at_pos = function() {};

suit.TextLayout.prototype.recalculate_layout = function() {
	var line_split = this.text.split("\n"); // TODO: Regex
	var number_of_lines = line_split.length;
	
	suit.TextLayout.canvas_context.font = this.get_css_font_string();
	
	var text_wrapped = [];
	
	if (this.width) { // Constrained to width
		for (var i = 0; i < number_of_lines; i++) {
		
			var line = line_split[i];
		
			var start_index = 0;
			var break_index = 0;
			var last_break_index = 0;
			
			var m, w;
			
			// FIXME: Change algorithm to wrap the last line of the paragraph as
			// well, like it should.
			while (m = line.substr(last_break_index).match(/. |-[^ ]/)) {
				break_index += m.index+1;
				
				if ((w = this.text_width(line.substring(start_index, break_index)))
					> this.width) {
					
					var wrap_line = line.substring(start_index, last_break_index);
					if (start_index !== 0) wrap_line = wrap_line.replace(/^\s+/, "");
					
					text_wrapped.push(wrap_line);
					start_index = last_break_index;
					
				}
				last_break_index = break_index;
			
			}
			
			text_wrapped.push(line.substring(start_index).replace(/^\s+/, ""));
			
		}
	} else {
		text_wrapped = line_split;
	}
	
	// FIXME: Avoid going through a second time to find longest line
	var apparent_width = 0;
	for (var i = 0, len = text_wrapped.length; i < len; i++) {
		apparent_width = Math.max(apparent_width, this.text_width(text_wrapped[i]));
	}
	
	
	var line_height = this.get_line_height();
	
	this.apparent_width = apparent_width;
	this.apparent_height = line_height * text_wrapped.length;
	
	this.calculated = true;
	this.text_wrapped = text_wrapped;
};

suit.TextLayout.prototype.get_apparent_height = function() {
	if (!this.calculated) this.recalculate_layout();
	return this.apparent_height;
};

suit.TextLayout.prototype.get_apparent_width = function() {
	if (!this.calculated) this.recalculate_layout();
	return this.apparent_width;
};

suit.TextLayout.prototype.get_line_height = function() {
	return (this.line_height !== null) ? this.line_height : this.font_size;
}

suit.TextLayout.prototype.render = function(context, x, y) {
	if (!this.calculated) this.recalculate_layout();
	
	context.save();
	context.font = this.get_css_font_string();
	context.textBaseline = "top";
	context.textAlign = this.align;
	
	var line_height = this.get_line_height();
	
	for (var i = 0, len = this.text_wrapped.length; i < len; i++) {
		context.fillText(this.text_wrapped[i], x,
			(y + i * line_height + (line_height/2-this.font_size/2)) | 0 );
	};
	
	context.restore();
};
