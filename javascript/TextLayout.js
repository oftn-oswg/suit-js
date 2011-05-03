var TextLayout = function(context) {
	this.context = context;
	this.text = "";
	this.text_split = [""];
	
	this.font_name = null;
	this.font_size = null;
	
	this.line_sizes = [0];
	this.word_sizes = [[0]];
	this.space_width = 0;
	
	this.align = "left";
	this.width = null; // Infinite
	this.calculated = true;
};

TextLayout.canvas_context = (function() {
	var c = document.createElement('canvas');
	return c.getContext('2d');
})();

TextLayout.prototype.text_width = function(string) {
	var cc = TextLayout.canvas_context;
	cc.font = this.font;
	return cc.measureText(string).width;

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
	
	var line_sizes = new Array(number_of_lines);
	var word_sizes = new Array(number_of_lines);
	for (var i = 0; i < number_of_lines; i++) {
		line_sizes[i] = this.text_width(line_split[i]);
		
		var word_split = line_split[i].split(" "); // TODO: Regex
		var number_of_words = word_split.length;
		
		word_sizes[i] = new Array(number_of_words);
		for (var j = 0; j < number_of_words; j++) {
			word_sizes[i][j] = this.text_width(word_split[j]);
		}
	}
	
	this.line_split = line_split;
	this.line_sizes = line_sizes;
	this.word_sizes = word_sizes;
	this.space_width = this.text_width(" ");
	this.calculated = true;
};
