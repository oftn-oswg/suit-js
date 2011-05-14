suit.ProgressBar = function(text) {
	suit.Bin.call(this);
	
	this.orientation = "horizontal";
	this.fraction = 0;
	
	if (text) {
		this.set_child(new suit.Label(text));
		this.child.set_align ("center");
		this.child.set_valign ("middle");
	}
	
	this.style = {
		padding_top: 6,
		padding_bottom: 6,
		padding_left: 8,
		padding_right: 8
	};
};

suit.ProgressBar.prototype = suit.Bin.inherit();
suit.ProgressBar.prototype.name = "ProgressBar";

suit.ProgressBar.prototype.draw = function(context) {
	var a = this.allocation;
	
	context.set_fill_stroke ("#191919");
	context.rect(a.x, a.y, a.width, a.height);
	
	context.set_fill_stroke ("#333333");
	
	if (this.orientation === "horizontal") {
		context.rect(a.x, a.y, a.width*this.fraction | 0, a.height);
	} else {
		context.rect(a.x, a.y, a.width, a.height*this.fraction | 0);
	}
};

suit.ProgressBar.prototype.set_fraction = function(fraction) {
	this.fraction = fraction;
	this.queue_redraw();
};

suit.ProgressBar.prototype.get_fraction = function() {
	return this.fraction;
};
