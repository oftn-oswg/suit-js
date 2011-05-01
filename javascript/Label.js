var Label = function(text) {
	this.text = text;
	this.align = "left";
};
Label.prototype = SUIT.construct_prototype(Widget);

Label.prototype.set_text = function(text) {
	this.text = text;
	this.invalidate();
};

Label.prototype.draw = function() {
	var context = this.context;
	
	context.fillStyle = "rgb(0,0,0)";
	context.textAlign = "left";
	context.textBaseline = "top";
	context.font = "16px sans-serif";
	context.fillText (this.text, 0, 0);
};

Label.prototype.get_preferred_size = function(orientation) {
	
	var required_width = 0;
	var required_height = 0;
	
	this.context.measureText(this.text);
	
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
Label.prototype.get_preferred_width_for_height = function() {};
Label.prototype.get_preferred_height_for_width = function() {};

