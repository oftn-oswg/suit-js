suit.TextLayout = function() {
	this.text = "";
	this.text_wrapped = [""];
	
	this.font_name = "sans-serif";
	this.font_size = 14;
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

suit.TextLayout.prototype.get_index_at_pos = function(x, y) {
	var line_size = this.get_line_size();
	var line_nums = this.text_wrapped.length;
	
	var line_n = (y / line_size) | 0;
	line_n = (line_n > line_nums ? line_nums : (line_n < 0 ? 0 : line_n));
	
	var line = this.text_wrapped[line_n];
	
	// TODO: Start with best guess and test on each side, 1 char at a time until found
	// TODO: Support align center and right
	var col_n = 0;
	suit.TextLayout.canvas_context.font = this.get_css_font_string();
	if (x <= 0 || line.length == 0) { col_n = 0; }
	else if (x >= this.text_width(line)) { col_n = line.length; }
	else {
		for (var i = 0, len = line.length; i <= len; i++) {
			var wi = (i == 0) ? 0 : this.text_width(line.substring(0, i));
			wi += (this.text_width(line.charAt(i))/2) | 0;
			if (wi >= x) {
				col_n = i;
				break;
			}
		}
	}
	
	return [line_n, col_n, line.charAt(col_n)];
};

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
			
			/* The regex is a |-seperated list of two points:
			 * The first is a point (or char) before a possible break
			 * The second is a point (or char) after the possible break
			 */
			while (m = line.substr(last_break_index).match(/. |-[^ ]|.$/)) {
				break_index += m.index+1;
				
				if ((w = this.text_width(line.substring(start_index, break_index)))
					> this.width) {
					
					var wrap_line = line.substring(start_index, last_break_index);
					
					/*
					 * TODO: 
					 *  - Push wrapped line with whitespace
					 *  - Test line width without whitespace
					 *  - Render text without whitespace
					 */
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
	
	
	var line_size = this.get_line_size();
	
	this.apparent_width = apparent_width;
	this.apparent_height = line_size * text_wrapped.length;
	
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

suit.TextLayout.prototype.get_line_size = function() {
	return (this.line_height !== null) ? this.font_size * this.line_height : this.font_size;
}

suit.TextLayout.prototype.render = function(context, x, y) {
	if (!this.calculated) this.recalculate_layout();
	
	context.cc.save();
	context.cc.font = this.get_css_font_string();
	context.cc.textBaseline = "top";
	context.cc.textAlign = this.align;
	
	var line_size = this.get_line_size();
	
	// Contrain rendered lines to clipping area
	var i = 0;
	var len, lines_n;
	len = lines_n = this.text_wrapped.length;
	var clip = context.get_clip();
	if (clip.y > y) {
		i = (((clip.y - y)/line_size) | 0);
		i = i < 0 ? 0 : i;
	}
	if (clip.height) {
		len = i + ((clip.height/line_size) | 0) + 2;
		len = len > lines_n ? lines_n : len;
	}
	
	for (;i < len; i++) {
		context.cc.fillText(this.text_wrapped[i], x,
			(y + i * line_size + (line_size/2-this.font_size/2)) | 0 );
	};
	
	context.cc.restore();
};
