suit.ProgressBar = function SUITProgressBar(text) {
	suit.Bin.call(this);
	
	if (text) {
		suit.ensure(text, "string");
		
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

suit.inherit (suit.ProgressBar, suit.Bin);

// Default instance variables
suit.ProgressBar.prototype.name = "ProgressBar";
suit.ProgressBar.prototype.orientation = "horizontal";
suit.ProgressBar.prototype.fraction = 0;

suit.ProgressBar.prototype.draw = function(context) {
	suit.ensure(context, suit.Graphics);
	
	var a = this.allocation;
	
	context.set_fill_stroke ("#191919");
	context.rect(a.x, a.y, a.width, a.height);
	
	context.set_fill_stroke ("#333333");
	
	if (this.orientation === "horizontal") {
		context.rect(a.x, a.y, a.width*this.fraction | 0, a.height);
	} else {
		context.rect(a.x, a.y, a.width, a.height*this.fraction | 0);
	}
	return this;
};

suit.ProgressBar.prototype.set_fraction = function(fraction) {
	suit.ensure(fraction, "number");
	
	this.fraction = fraction;
	this.queue_redraw();
	return this;
};

suit.ProgressBar.prototype.get_fraction = function() {
	return this.fraction;
};
