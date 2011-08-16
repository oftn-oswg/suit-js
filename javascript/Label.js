suit.Label = function SUITLabel(text) {
	suit.Widget.call(this);

	if (text) this.text = text;

	this.set_has_window (true);
};

suit.Label.inherit (suit.Widget);

// Default instance variables
suit.Label.prototype.name = "Label";
suit.Label.prototype.updated = false;
suit.Label.prototype.align = "left";
suit.Label.prototype.valign = "top"; // top, middle, bottom

suit.Label.metric = (function() {
	var offscreen = document.createElement ("div");
	offscreen.style.position = "absolute";
	offscreen.style.display = "none";
	offscreen.style.whiteSpace = "pre-wrap";
	document.body.appendChild (offscreen);
	return offscreen;
})();

suit.Label.prototype.realize = function() {
	var window, allocation;

	if (!this.realized) {

		allocation = this.allocation;

		if (allocation) {
			this.size_allocate (allocation);
		}

		window = new suit.Window(this.get_parent_window(), this, true);
		window.move_resize (allocation);

		window.base.style.whiteSpace = "pre-wrap";
		window.base.style.overflow = "visible";
		window.base.style.color = "white";
		window.base.style.textAlign = this.align;
		this.set_element_text (window.base, this.text);

		this.window = window;
	}

	this.realized = true;

};


suit.Label.prototype.set_text = function(text) {
	text = String(text);

	if (this.realized) {
		this.set_element_text (this.window.base, text);
	}

	this.text = text;

	this.queue_resize ();
};

suit.Label.prototype.set_align = function(align) {
	suit.ensure(align, "string");
	
	this.align = align;
	if (this.realized) {
		this.window.base.style.textAlign = align;
	}
};

suit.Label.prototype.set_valign = function(valign) {
	suit.ensure(valign, "string");
	
	this.valign = valign;
	this.queue_redraw();
};

suit.Label.prototype.set_line_height = function(line_height) {
};

suit.Label.prototype.set_element_text = function(element, text) {
	while (element.hasChildNodes()) element.removeChild(element.lastChild);
	element.appendChild(document.createTextNode(text));
};

suit.Label.prototype.get_request_mode = function() {
	return SizeRequestMode.HEIGHT_FOR_WIDTH; // TODO: Rotatable text labels
};

suit.Label.prototype.get_preferred_width = function() {
	var width, ostyle;

	ostyle = suit.Label.metric.style;

	this.set_element_text (suit.Label.metric, this.text);

	ostyle.display = "block";
	ostyle.height = "auto";
	ostyle.width = "auto";

	width = suit.Label.metric.clientWidth + 1;

	ostyle.display = "none";

	return {
		minimum: width,
		natural: width
	};
};
suit.Label.prototype.get_preferred_height = function() {
	var height, ostyle;

	ostyle = suit.Label.metric.style;

	this.set_element_text (suit.Label.metric, this.text);

	ostyle.display = "block";
	ostyle.height = "auto";
	ostyle.width = "auto";

	height = suit.Label.metric.clientHeight + 1;

	ostyle.display = "none";

	return {
		minimum: height,
		natural: height
	};
};
suit.Label.prototype.get_preferred_height_for_width = function(width) {
	var height, ostyle;

	ostyle = suit.Label.metric.style;

	this.set_element_text (suit.Label.metric, this.text);

	ostyle.display = "block";
	ostyle.width = width+"px";
	ostyle.height = "auto";

	height = suit.Label.metric.clientHeight + 1;

	ostyle.display = "none";

	return {
		minimum: height,
		natural: height
	};
};
suit.Label.prototype.get_preferred_width_for_height = function(height) {
	var width, ostyle;

	ostyle = suit.Label.metric.style;

	this.set_element_text (suit.Label.metric, this.text);

	ostyle.display = "block";
	ostyle.width = "auto";
	ostyle.height = height+"px";

	width = suit.Label.metric.clientWidth + 1;

	ostyle.display = "none";

	return {
		minimum: width,
		natural: width
	};
};
