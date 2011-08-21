suit.Window = function SUITWindow(parent, widget, empty) {
	var base, canvas, context, unique, nsuri;

	suit.ensure (parent, "object");
	if (!parent) throw new Error("suit.Window requires a parent");

	suit.Object.call(this);

	unique = suit.unique();

	nsuri = "http://www.w3.org/1999/xhtml";

	base = document.createElementNS(nsuri, "div");
	base.className = "suit suit_"+widget.name;
	base.style.top = 0;
	base.style.left = 0;

	if (!empty) {
		canvas = document.createElementNS(nsuri, "canvas");
		canvas.suit_unique = unique;
		context = new suit.Graphics(canvas.getContext("2d"));
		base.appendChild(canvas);
	} else {
		base.suit_unique = unique;
		base.suit_empty = true;
	}

	this.base = base;
	this.unique = unique;
	this.parent = parent;
	this.canvas = canvas;
	this.widget = widget;
	this.context = context;

	if (typeof parent.appendChild === "function") {
		parent.appendChild (base);
	} else {
		parent.add_window (this);
	}

	if (widget) {
		suit.widgets[unique] = widget;
	}

};

suit.inherit (suit.Window, suit.Object);

// We need a reference back to the widget.
suit.Window.prototype.widget = null;
suit.Window.prototype.x = 0;
suit.Window.prototype.y = 0;
suit.Window.prototype.width = 0;
suit.Window.prototype.height = 0;

suit.Window.prototype.destroy = function() {
	var parent;

	parent = this.parent;
	if (typeof parent.removeChild === "function") {
		parent.removeChild (this.base);
	} else {
		parent.remove_window (this);
	}

	if (this.widget) {
		delete suit.widgets[this.unique];
	}
};


suit.Window.prototype.reparent = function(parent) {
	var base, parent;

	base = this.base.parentNode.removeChild (this.base);

	if (typeof parent.appendChild === "function") {
		parent.appendChild (base);
	} else {
		parent.add_window (this);
	}

	this.parent = parent;

};


suit.Window.prototype.add_window = function(window) {
	this.base.appendChild (window.base);
};


suit.Window.prototype.remove_window = function(window) {
	this.base.removeChild (window.base);
};


suit.Window.prototype.invalidate = function() {
	if (this.widget && this.context) {
		this.context.clear ();
		this.widget.draw (this.context);
	}
};


suit.Window.prototype.invalidate_area = function(x, y, width, height) {
	var context, widget;

	widget = this.widget;
	context = this.context;

	if (widget && context) {
		context.save ();

		context.clip (x, y, width, height);
		context.clear_area (x, y, width, height);
		widget.draw (this.context);

		context.restore ();
	}
};


suit.Window.prototype.move = function(x, y) {
	suit.ensure (x, "number");
	suit.ensure (y, "number");

	var base = this.base;

	if (x !== this.x) {
		base.style.left = x + "px";
		this.x = x;
	}

	if (y !== this.y) {
		base.style.top = y + "px";
		this.y = y;
	}
};


suit.Window.prototype.resize = function(width, height) {
	suit.ensure (width, "number");
	suit.ensure (height, "number");

	var base;
	var canvas;
	var invalidate;

	base = this.base;
	canvas = this.canvas;
	invalidate = false;

	if (width !== this.width) {
		base.style.width = width + "px";
		if (canvas) {
			canvas.width = width;
			invalidate = true;
		}
		this.width = width;
	}

	if (height !== this.height) {
		base.style.height = height + "px";
		if (canvas) {
			canvas.height = height;
			invalidate = true;
		}
		this.height = height;
	}
	
	if (invalidate) this.invalidate ();
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
