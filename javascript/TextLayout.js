var TextLayout = function(context) {
	this.context = context;
	this.text = "";
	this.text_wrapped = [""];
	
	this.font_name = null;
	this.font_size = null;
	
	this.line_sizes = [0];
	this.word_sizes = [[0]];
	this.space_width = 0;
	
	this.align = "left";
	this.width = null; // Infinite
	this.calculated = true;
	
	this.apparent_width = null;
	this.apparent_height = null;
};

TextLayout.canvas_context = (function() {
	var c = document.createElement('canvas');
	return c.getContext('2d');
})();

TextLayout.prototype.text_width = function(string) {
	var cc = TextLayout.canvas_context;
	//cc.font = this.font;
	return cc.measureText(string).width;
};

TextLayout.prototype.set_text = function (text) {
	this.text = text;
	this.calculated = false;
};

TextLayout.prototype.set_font = function (font) {
	this.font = font;
	this.calculated = false;
};

TextLayout.prototype.set_align = function (align) {
	this.align = align;
	this.calculated = false;
};

TextLayout.prototype.set_width = function (width) {
	this.width = width;
	this.calculated = false;
};

TextLayout.prototype.recalculate_layout = function() {
	var line_split = this.text.split("\n"); // TODO: Regex
	var number_of_lines = line_split.length;
	
	TextLayout.canvas_context.font = this.font_size + "px \""+this.font_name+"\"";
	
	var text_wrapped = [];
	
	if (this.width === null) { // No bounding width on layout
		var apparent_width = 0;
		for (var i = 0; i < number_of_lines; i++) {
			apparent_width = Math.max(apparent_width,
				this.text_width (line_split[i]));
		}
		this.apparent_width = apparent_width;
		this.apparent_height = this.font_size * number_of_lines;
		
		text_wrapped = line_split;
		
	} else { // Constrained to width
		for (var i = 0; i < number_of_lines; i++) {
		
			var line = line_split[i];
		
			var start_index = 0;
			var break_index = 0;
			var last_break_index = 0;
			
			var m, w;
			
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
	}
	this.calculated = true;
	this.text_wrapped = text_wrapped;
};
