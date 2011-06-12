suit.Bin = function() {
	suit.Container.call(this);
	this.child = null;
};

suit.Bin.prototype = suit.Container.inherit();
suit.Bin.prototype.name = "Bin";

suit.Bin.prototype.set_child = function(widget) {
	suit.ensure(widget, suit.Widget);

	if (!this.child) {
		this.child = widget;
		suit.Container.prototype.add.call(this, widget);
	} else {
		suit.error("#%s already has child widget #%s.", this.name, this.child.name);
	}
};

suit.Bin.prototype.get_child = function() {
	if (this.child) return this.child;
	return false;
};

suit.Bin.prototype.clear_child = function() {
	this.child = null;
	this.remove_all();
};

suit.Bin.prototype.add = function() {
	suit.error("#%s is a Bin widget and can only hold one child, use set_child to add a child.", this.name);
	return false;
};

suit.Bin.prototype.remove = function() {
	suit.error("#%s is a Bin widget; use clear_child to remove its child.", this.name);
	return false;
};

suit.Bin.prototype.get_request_mode = function() {
	if (this.child) {
		return this.child.get_request_mode ();
	}
	return SizeRequestMode.HEIGHT_FOR_WIDTH;
};
suit.Bin.prototype.get_preferred_width = function() {
	var padding = this.style ? this.style.padding_left + this.style.padding_right : 0;
	var preferred = {
		minimum: padding,
		natural: padding
	};
	
	if (this.child) {
		var childpref = this.child.get_preferred_width();
		preferred.minimum += childpref.minimum;
		preferred.natural += childpref.natural;
	}
	return preferred;
};
suit.Bin.prototype.get_preferred_height = function() {
	var padding = this.style ? this.style.padding_top + this.style.padding_bottom : 0;
	var preferred = {
		minimum: padding,
		natural: padding
	};
	
	if (this.child) {
		var childpref = this.child.get_preferred_height();
		preferred.minimum += childpref.minimum;
		preferred.natural += childpref.natural;
	}
	return preferred;
};
suit.Bin.prototype.get_preferred_width_for_height = function(height) {
	suit.ensure(height, "number");
	
	var padding = this.style ? this.style.padding_left + this.style.padding_right : 0;
	var preferred = {
		minimum: padding,
		natural: padding
	};
	
	if (this.child) {
		var childpref = this.child.get_preferred_width_for_height(height);
		preferred.minimum += childpref.minimum;
		preferred.natural += childpref.natural;
	}
	return preferred;
};
suit.Bin.prototype.get_preferred_height_for_width = function(width) {
	suit.ensure(width, "number");
	
	var padding = this.style ? this.style.padding_top + this.style.padding_bottom : 0;
	var preferred = {
		minimum: padding,
		natural: padding
	};
	
	if (this.child) {
		var childpref = this.child.get_preferred_height_for_width(width);
		preferred.minimum += childpref.minimum;
		preferred.natural += childpref.natural;
	}
	return preferred;
};
