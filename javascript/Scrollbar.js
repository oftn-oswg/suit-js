suit.Scrollbar = function(orientation) {
	suit.Widget.call(this);
	
	this.orientation = orientation || "vertical";
	
	this.style = {
		track_size: 16
	};
	
	this.scroll = 0;      // The amount of scroll on the child
	this.scroll_size = 0; // The size of the child widget
	
	suit.error("Why did you make a scrollbar?");
};

suit.Scrollbar.prototype = suit.Widget.inherit();
suit.Scrollbar.prototype.name = "Scrollbar";

suit.Scrollbar.prototype.draw = function(context) {
	suit.ensure(context, suit.Graphics);
	
	var a = this.allocation;
	
	context.set_stroke_style (4, "round");
	context.set_fill_stroke (null, "#333");
	
	if (this.orientation === "horizontal") {
		var y = a.height/2 | 0;
		var x = 6 + ((-this.scroll) / this.scroll_size * a.width);
		var w = a.width/this.scroll_size*(a.width-12) - 12;
		context.path([
			[x, y],
			[x+w, y]
		]);
	} else {
		var x = a.width/2 | 0;
		var y = 6 + ((-this.scroll) / this.scroll_size * a.height);
		var h = a.height/this.scroll_size*(a.height-12) - 12;
		context.path([
			[x, y],
			[x, y+h]
		]);
	}
	return this;
};


suit.Scrollbar.prototype.get_request_mode = function() {
	return SizeRequestMode.HEIGHT_FOR_WIDTH;
};
suit.Scrollbar.prototype.get_preferred_width = function() {
	var preferred = {
		minimum: 6,
		natural: 6
	}
	return preferred;
};
suit.Scrollbar.prototype.get_preferred_height = function() {
	var preferred = {
		minimum: 6,
		natural: 6
	};
	return preferred;
};
suit.Scrollbar.prototype.get_preferred_width_for_height = function(height) {
	suit.ensure(height, "number");
	var preferred = {
		minimum: 6,
		natural: 6
	};
	return preferred;
};
suit.Scrollbar.prototype.get_preferred_height_for_width = function(width) {
	suit.ensure(width, "number");
	var preferred = {
		minimum: 6,
		natural: 6
	};
	return preferred;
};
