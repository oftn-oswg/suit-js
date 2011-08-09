suit.Window = function(parent, empty) {
	var base, canvas, context;
	suit.ensure (parent, "object");

	suit.Object.call(this);

	base = document.createElement("div");
	base.className = "suit_window";
	base.style.position = "absolute";
	base.style.top = "0";
	base.style.left = "0";

	if (!empty) {
		canvas = document.createElement("canvas");
		context = new suit.Graphics(canvas.getContext("2d"));
		base.appendChild(canvas);
	}

	if (typeof parent.appendChild === "function") {
		parent.appendChild (base);
	} else {
		parent.add_window (this);
	}

	this.base = base;
	this.parent = parent;
	this.canvas = canvas;
	this.context = context;
};

suit.Window.prototype = suit.Object.inherit();

// We need a reference back to the widget.
suit.Window.prototype.widget = null;

suit.Window.prototype.destroy = function() {
	var parent;

	parent = this.parent;
	if (typeof parent.removeChild === "function") {
		parent.removeChild (this.base);
	} else {
		parent.remove_window (this);
	}
};


suit.Window.prototype.add_window = function(window) {
	this.base.appendChild (window.base);
};


suit.Window.prototype.remove_window = function(window) {
	this.base.removeChild (window.base);
};


suit.Window.prototype.move = function(x, y) {
	suit.ensure (x, "number");
	suit.ensure (y, "number");

	var base = this.base;

	base.style.top = x + "px";
	base.style.left = y + "px";
};


suit.Window.prototype.resize = function(width, height) {
	suit.ensure (width, "number");
	suit.ensure (height, "number");

	var base = this.base;

	base.style.width = width + "px";
	base.style.height = height + "px";

	var canvas = this.canvas;
	if (canvas) {
		canvas.width = width;
		canvas.height = height;
	}
};


suit.Window.prototype.move_resize = function(x, y, w, h) {

	if (arguments.length === 1) {
		suit.ensure (x, suit.Allocation);
		h = x.height;
		w = x.width;
		y = x.y;
		x = x.x;
	}

	this.move(x, y);
	this.resize(w, h);
};


suit.Window.prototype.append_to = function(element) {
	element.appendChild(this.base);
};


suit.Window.prototype.event_mask_add = function(bits) {
	suit.ensure(bits, "number");
	
	this.event_mask |= bits;
	return this;
};


suit.Window.prototype.event_mask_sub = function(bits) {
	suit.ensure(bits, "number");
	
	this.event_mask ^= bits;
	return this;
};


suit.Window.prototype.lock = function() {
	if (suit.lock && suit.lock !== this) {
		suit.error("Events are already locked by another window.");
		return false;
	}
	suit.lock = this;
	return true;
};


suit.Window.prototype.unlock = function() {
	suit.lock = null;
};
