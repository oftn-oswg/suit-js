suit.Label = function SUITLabel(text) {
	var style;

	suit.Widget.call(this);

	this.set_has_window (true);

	// Should use document.documentElement here,
	// but since there might not be a <body> element,
	// I should find a way around this sometime.
	this.window = new suit.Window (suit.Label.container, this, true);
	style = this.window.base.style;
	
	style.display = "none";
	style.whiteSpace = "pre-wrap";
	style.overflow = "visible";
	style.color = "white";

	this.update_properties ();

	this.cache_pref_width = null;
	this.cache_pref_height = null;
	this.cache_pref_wfh = [];
	this.cache_pref_hfw = [];

	if (text) this.set_text (text);
};

suit.Label.container = (function() {
	var container;

	container = document.documentElement.appendChild(document.createElementNS("http://www.w3.org/1999/xhtml", "_"));
	container.className = "suit";
	container.style.width = 0;
	container.style.height = 0;

	return container;
})();

suit.inherit (suit.Label, suit.Widget);

// Default instance variables
suit.Label.prototype.name = "Label";
suit.Label.prototype.updated = false;
suit.Label.prototype.align = "left";
suit.Label.prototype.valign = "top"; // top, middle, bottom
suit.Label.prototype.line_height = null;
suit.Label.prototype.selectable = true;

suit.Label.prototype.clear_cache = function() {
	this.cache_pref_width = null;
	this.cache_pref_height = null;
	this.cache_pref_wfh.length = 0;
	this.cache_pref_hfw.length = 0;
};

suit.Label.prototype.realize = function() {
	var window, base, parent, allocation;

	if (!this.realized) {

		allocation = this.allocation;

		if (allocation) {
			this.size_allocate (allocation);
		}

		window = this.window;
		window.reparent (this.get_parent_window ());
		window.base.style.display = "block";

		window.move_resize (allocation);
	}

	this.realized = true;

};


suit.Label.prototype.update_properties = function() {
	var base;

	base = this.window.base;
	base.style.textAlign = this.align;
	base.style.lineHeight = this.line_height ? this.line_height + "em" : "normal";

	if (this.selectable) {
		base.style.cursor = "auto";
	} else {
		base.style.cursor = "default";
		base.style.userSelect = "none";
		base.style.MozUserSelect = "none";
		base.style.KhtmlUserSelect = "none";
	}
};


suit.Label.prototype.set_text = function(text) {
	text = String(text);

	if (this.text !== text) {
		this.clear_cache ();
		this.set_element_text (this.window.base, text);
		this.text = text;
		this.queue_resize ();
	}
};

suit.Label.prototype.set_align = function(align) {
	suit.ensure(align, "string");
	
	if (this.align !== align) {
		this.align = align;
		this.update_properties ();
	}
};

suit.Label.prototype.set_valign = function(valign) {
	suit.ensure(valign, "string");
	
	if (this.valign !== valign) {
		this.valign = valign;
		this.update_properties ();
	}
};

suit.Label.prototype.set_line_height = function(line_height) {
	if (this.line_height !== line_height) {
		this.line_height = line_height;
		this.update_properties ();
		this.clear_cache ();
		this.queue_resize ();
	}
};

suit.Label.prototype.set_selectable = function(selectable) {
	suit.ensure(selectable, "boolean");

	if (this.selectable !== selectable) {
		this.selectable = selectable;
		this.update_properties ();
	}
};

suit.Label.prototype.set_element_text = function(element, text) {
	while (element.firstChild) {
		element.removeChild(element.firstChild);
	}
	element.appendChild(document.createTextNode(text));
};

suit.Label.prototype.get_request_mode = function() {
	return SizeRequestMode.HEIGHT_FOR_WIDTH; // TODO: Rotatable text labels
};

suit.Label.prototype.get_preferred_width = function() {
	var width, realized, ostyle, ow, oh;

	if (this.cache_pref_width !== null) {
		width = this.cache_pref_width;
	} else {

		realized = this.realized;
		ostyle = this.window.base.style;

		if (!realized) {
			ostyle.display = "block";
		} else {
			ow = ostyle.width;
			oh = ostyle.height;
		}

		ostyle.height = "auto";
		ostyle.width = "auto";

		width = this.cache_pref_width = this.window.base.offsetWidth + 1;

		if (!realized) {
			ostyle.display = "none";
		} else {
			ostyle.width = ow;
			ostyle.height = oh;
		}
	}

	return {
		minimum: width,
		natural: width
	};
};

suit.Label.prototype.get_preferred_height = function() {
	var height, realized, ostyle, ow, oh;

	if (this.cache_pref_height !== null) {
		height = this.cache_pref_height;
	} else {

		realized = this.realized;
		ostyle = this.window.base.style;

		if (!realized) {
			ostyle.display = "block";
		} else {
			ow = ostyle.width;
			oh = ostyle.height;
		}

		ostyle.height = "auto";
		ostyle.width = "auto";

		height = this.cache_pref_height = this.window.base.offsetHeight + 1;

		if (!realized) {
			ostyle.display = "none";
		} else {
			ostyle.width = ow;
			ostyle.height = oh;
		}
	}

	return {
		minimum: height,
		natural: height
	};
};



suit.Label.prototype.get_preferred_height_for_width = function(width) {
	var height, realized, ostyle, ow, oh;

	if (this.cache_pref_hfw[width] != null) {
		height = this.cache_pref_hfw[width];
	} else {

		realized = this.realized;
		ostyle = this.window.base.style;

		if (!realized) {
			ostyle.display = "block";
		} else {
			ow = ostyle.width;
			oh = ostyle.height;
		}

		ostyle.height = "auto";
		ostyle.width = width+"px";

		height = this.cache_pref_hfw[width] = this.window.base.offsetHeight + 1;

		if (!realized) {
			ostyle.display = "none";
		} else {
			ostyle.width = ow;
			ostyle.height = oh;
		}
	}

	return {
		minimum: height,
		natural: height
	};
};


suit.Label.prototype.get_preferred_width_for_height = function(height) {
	var width, realized, ostyle, ow, oh;

	if (this.cache_pref_wfh[height] != null) {
		width = this.cache_pref_wfh[height];
	} else {

		realized = this.realized;
		ostyle = this.window.base.style;

		if (!realized) {
			ostyle.display = "block";
		} else {
			ow = ostyle.width;
			oh = ostyle.height;
		}

		ostyle.height = height+"px";
		ostyle.width = "auto";

		width = this.cache_pref_wfh[height] = this.window.base.offsetWidth + 1;

		if (!realized) {
			ostyle.display = "none";
		} else {
			ostyle.width = ow;
			ostyle.height = oh;
		}
	}

	return {
		minimum: width,
		natural: width
	};
};
