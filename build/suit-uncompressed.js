var suit = {};

Function.prototype.inherit = function() {
	var f = function() {};
	f.prototype = this.prototype;
	return new f();
};

if (!Function.prototype.bind) {
	Function.prototype.bind = function( obj ) {
		var slice = [].slice,
			args = slice.call(arguments, 1), 
			self = this, 
			nop = function () {}, 
			bound = function () {
				return self.apply( this instanceof nop ? this : ( obj || {} ), 
					args.concat( slice.call(arguments) ) );    
			};
		nop.prototype = self.prototype;
		bound.prototype = new nop();
		return bound;
	};
}

if (!Array.isArray) {
	Array.isArray = function(o) {
		return Object.prototype.toString.call(o) === "[object Array]";
	};
}
suit.Event = {
	None: 0,
	
	ButtonPress: 1,
	ButtonRelease: 2,
	ButtonDblPress: 4,

	KeyPress: 8,
	KeyRelease: 16,
	
	Scroll: 32,
	
	Motion: 64
};

suit.Modifiers = {
	None: 0,
	Shift: 1,
	CapsLock: 2,
	Ctrl: 4,
	Alt: 8,
	Super: 16
};

// Keyboard button events
suit.EventKey = function(type, state, keycode) {
	this.type = type; // KeyPress | KeyRelease
	//this.time = new Date(); // Time the event was generated
	this.state = state; // (Modifiers -- shift, ctrl, capslock, alt)
	this.keycode = keycode; // The key code
};
suit.EventKey.prototype.name = "event_key";

// Mouse button events
suit.EventButton = function(type, state, button, x, y, id) {
	this.type = type; // ButtonPress | ButtonRelease | ButtonDblPress
	//this.time = new Date(); // Time the event was generated
	this.state = state; // (Modifiers -- shift, ctrl, capslock, alt)
	this.button = button; // Left click: 1, Middle click: 2, Right click: 3
	this.x = x; // x-coordinate of mouse when event occured
	this.y = y; // y-coordinate of mouse when event occured
	this.id = id; // Used for multitouch
};
suit.EventButton.prototype.name = "event_button";

// Mouse wheel scroll events
suit.EventScroll = function(state, x, y, deltax, deltay, id) {
	this.type = suit.Event.Scroll;
	//this.time = new Date(); // Time the event was generated
	this.state = state; // (Modifiers -- shift, ctrl, capslock, alt)
	this.x = x; // x-coordinate of mouse when event occured
	this.y = y; // y-coordinate of mouse when event occured
	this.deltaX = deltax; // amount of scroll horizontally
	this.deltaY = deltay; // amount of scroll vertically
	this.id = id; // Used for multitouch
};
suit.EventScroll.prototype.name = "event_scroll";

// Move move events
suit.EventMotion = function(state, x, y, id) {
	this.type = suit.Event.Motion;
	//this.time = new Date(); // Time the event was generated
	this.state = state; // (Modifiers -- shift, ctrl, capslock, alt)
	this.x = x; // x-coordinate of mouse when event occured
	this.y = y; // y-coordinate of mouse when event occured
	this.id = id; // Used for multitouch
};
suit.EventMotion.prototype.name = "event_motion";
suit.Allocation = function(x, y, width, height) {
	this.x = x | 0;
	this.y = y | 0;
	this.width = width > 1 ? width | 0 : 1;
	this.height = height > 1 ? height | 0 : 1;
};

suit.Allocation.prototype.args = function() {
	return [this.x, this.y, this.width, this.height];
};
suit.Object = function() {
	this.signals = {};
};

suit.Object.prototype.connect = function( signal, fn ) {

	if( typeof this.signals[signal] == 'undefined' ) {
		this.signals[signal] = [];
	}
	this.signals[signal].push({
		'callback': fn,
		'extras': Array.prototype.slice.call(arguments, 2)
	});
	return true;
};

suit.Object.prototype.disconnect = function( signal, fn ) {

	if( typeof this.signals[signal] == 'undefined' )
		return false;

	for( var i = 0, len = this.signals[signal].length; i < len; i++ ) {
		if( this.signals[signal][i]['callback'] === fn ) {
			this.signals[signal].splice(i, 1);
			return true;
		}
	}

	return true;

};

suit.Object.prototype.emit = function( signal ) {

	if( typeof this.signals[signal] == 'undefined' )
		return false;

	var args = Array.prototype.slice.call(arguments, 1);

	for( var i = 0, len = this.signals[signal].length; i < len; i++ ) {
		this.signals[signal][i]['callback'].apply(this,
			args.concat(this.signals[signal][i]['extras']));
	}

};
suit.TextLayout = function() {
	suit.Object.call(this);

	this.text = "";
	this.text_split = [""]
	this.text_wrapped = [""];
	
	this.font_name = "sans-serif";
	this.font_size = 14;
	this.line_height = null;
	
	this.align = "left";
	this.width = null; // Infinite
	this.calculated = true;
};

suit.TextLayout.canvas_context = (function() {
	var c = document.createElement('canvas');
	return c.getContext('2d');
})();

suit.TextLayout.prototype = suit.Object.inherit();

suit.TextLayout.prototype.text_width = function(string) {
	return suit.TextLayout.canvas_context.measureText(string).width;
};

suit.TextLayout.prototype.set_text = function (text) {
	this.text = text;
	this.text_split = text.split("\n");
	this.calculated = false;
	this.emit('resize');
};

suit.TextLayout.prototype.set_font = function (font_name, font_size) {
	if (font_name) {
		this.font_name = Array.isArray(font_name) ?
			"\""+font_name.join("\", \"")+"\"":
			"\""+font_name+"\"";
	}
	if (font_size) {
		this.font_size = font_size;
	}
	this.calculated = false;
	this.emit('resize');
};

suit.TextLayout.prototype.set_line_height = function (line_height) {
	this.line_height = line_height;
	this.emit('resize');
};

suit.TextLayout.prototype.set_align = function (align) {
	this.align = align;
};

suit.TextLayout.prototype.set_width = function (width) {
	this.width = width;
	this.calculated = false;
};

suit.TextLayout.prototype.get_css_font_string = function() {
	return this.font_size + "px "+this.font_name;
};

suit.TextLayout.prototype.get_index_at_pos = function(x, y) {
	var line_size = this.get_line_size();
	var line_nums = this.text_wrapped.length;
	
	var line_n = (y / line_size) | 0;
	line_n = (line_n > line_nums ? line_nums : (line_n < 0 ? 0 : line_n));
	
	var line = this.text_wrapped[line_n];
	
	// TODO: Start with best guess and test on each side, 1 char at a time until found
	// TODO: Support align center and right
	var col_n = 0;
	suit.TextLayout.canvas_context.font = this.get_css_font_string();
	if (x <= 0 || line.length == 0) { col_n = 0; }
	else if (x >= this.text_width(line)) { col_n = line.length; }
	else {
		for (var i = 0, len = line.length; i <= len; i++) {
			var wi = (i == 0) ? 0 : this.text_width(line.substring(0, i));
			wi += (this.text_width(line.charAt(i))/2) | 0;
			if (wi >= x) {
				col_n = i;
				break;
			}
		}
	}
	
	return [line_n, col_n, line.charAt(col_n)];
};

suit.TextLayout.prototype.recalculate_layout = function() {

	var text_wrapped;

	if (this.width) {
		text_wrapped = [];
		this.perform_text_wrap(this.text_split, this.width, function(line) {
			text_wrapped.push(line);
		});
	} else {
		text_wrapped = this.line_split;
	}
	
	this.calculated = true;
	this.text_wrapped = text_wrapped;
};

suit.TextLayout.prototype.perform_text_wrap = function(line_split, width, callback) {
	suit.TextLayout.canvas_context.font = this.get_css_font_string();
	
	for (var i = 0, len = line_split.length; i < len; i++) {
		var m;
		var line = line_split[i];
		var start_index = 0;
		var break_index = 0;
		var last_break_index = 0;
		
		/* The regex is a |-seperated list of two points:
		 * The first is a point (or char) before a possible break
		 * The second is a point (or char) after the possible break
		 */
		while (m = line.substr(last_break_index).match(/. |-[^ ]|.$/)) {
			break_index += m.index+1;
			if (this.text_width(line.substring(start_index, break_index)) > width) {
				var wrap_line = line.substring(start_index, last_break_index);
				/*
				 * TODO: 
				 *  - Push wrapped line with whitespace
				 *  - Test line width without whitespace
				 *  - Render text without whitespace
				 */
				//if (start_index !== 0) wrap_line = wrap_line.replace(/^\s+/, "");
				callback.call(this, wrap_line);
				start_index = last_break_index;
			}
			last_break_index = break_index;
		}
		callback.call(this, line.substring(start_index))//.replace(/^\s+/, ""));
	}
};

suit.TextLayout.prototype.get_preferred_height = function() {
	return this.text_split.length * this.get_line_size() + 1;
};

suit.TextLayout.prototype.get_preferred_width = function() {
	var preferred_width = 0;

	suit.TextLayout.canvas_context.font = this.get_css_font_string();
	for (var i = 0, len = this.text_split.length; i < len; i++) {
		preferred_width = Math.max(preferred_width, this.text_width(this.text_split[i]));
	}
	
	return preferred_width + 1 | 0;
};

suit.TextLayout.prototype.get_preferred_height_for_width = function(width) {
	var lines = 0, height = 0;
	this.perform_text_wrap(this.text_split, width, function(line) {
		lines++;
	});
	height = lines * this.get_line_size() + 1 | 0;
	return height;
};

suit.TextLayout.prototype.get_preferred_width_for_height = function(height) {
	return this.get_preferred_width();
};

suit.TextLayout.prototype.get_line_size = function() {
	return (this.line_height !== null) ? this.font_size * this.line_height : this.font_size;
}

suit.TextLayout.prototype.render = function(context, x, y) {
	if (!this.calculated) this.recalculate_layout();
	
	context.cc.save();
	context.cc.font = this.get_css_font_string();
	context.cc.textBaseline = "top";
	context.cc.textAlign = this.align;
	
	var line_size = this.get_line_size();
	
	// Contrain rendered lines to clipping area
	var i = 0;
	var len, lines_n;
	len = lines_n = this.text_wrapped.length;
	var clip = context.get_clip();
	if (clip.y > y) {
		i = (((clip.y - y)/line_size) | 0);
		i = i < 0 ? 0 : i;
	}
	if (clip.height) {
		len = i + ((clip.height/line_size) | 0) + 2;
		len = len > lines_n ? lines_n : len;
	}
	
	for (;i < len; i++) {
		context.cc.fillText(this.text_wrapped[i], x,
			(y + i * line_size + (line_size/2-this.font_size/2)) | 0 );
	};
	
	context.cc.restore();
};
suit.Graphics = function(context) {
	this.cc = context;
	this.clip = [];
}

suit.Graphics.prototype.rect = function(x, y, w, h, stroke, fill) {
	if (typeof stroke === "undefined" || stroke === null) stroke = false;
	if (typeof fill === "undefined" || fill === null) fill = true;

	if (fill) this.cc.fillRect (x, y, w, h);
	if (stroke) this.cc.strokeRect (x, y, w, h);
};

suit.Graphics.prototype.push_clip = function(x, y, w, h) {
	this.cc.save();
	this.cc.beginPath();
	this.cc.rect (x, y, w, h);
	this.cc.clip();
	this.clip.push({x: x, y: y, width: w, height: h});
};

suit.Graphics.prototype.pop_clip = function() {
	this.cc.restore();
	this.clip.pop();
};

suit.Graphics.prototype.get_clip = function() {
	return this.clip.length ? this.clip[this.clip.length-1] : null;
};

suit.Graphics.prototype.path = function(data, closepath, stroke, fill) {
	if (typeof closepath === "undefined" || closepath === null) closepath = false;
	if (typeof stroke === "undefined" || stroke === null) stroke = true;
	if (typeof fill === "undefined" || fill === null) fill = false;

	this.cc.beginPath();
	for (var i = 0, len = data.length; i < len; i++) {
		if (!i) {
			this.cc.moveTo(data[i][0]+0.5, data[i][1]+0.5);
		} else {
			this.cc.lineTo(data[i][0]+0.5, data[i][1]+0.5);
		}
	}
	if (closepath) this.cc.closePath();
	if (stroke) this.cc.stroke();
	if (fill) this.cc.fill();
};

suit.Graphics.prototype.set_shadow = function(offsetX, offsetY, blur, color) {
	// Call with no arguments to remove shadow
	if (arguments.length) {
		if (typeof offsetX !== "undefined" && offsetX !== null) this.cc.shadowOffsetX = offsetX;
		if (typeof offsetY !== "undefined" && offsetY !== null) this.cc.shadowOffsetY = offsetY;
		if (typeof blur !== "undefined" && blur !== null) this.cc.shadowBlur = blur;
		if (typeof color !== "undefined" && color !== null) this.cc.shadowColor = color;
	} else {
		this.cc.shadowOffsetX = 0;
		this.cc.shadowOffsetY = 0;
		this.cc.shadowBlur = 0;
		this.cc.shadowColor = "transparent";
	}
};

suit.Graphics.prototype.create_linear_gradient = function(x, y, x2, y2, data) {
	var gradient = this.cc.createLinearGradient(x, y, x2, y2);
	for (var i = 0, len = data.length; i < len; i++) {
		gradient.addColorStop (data[i][0], data[i][1]);
	}
	return gradient;
};

suit.Graphics.prototype.set_stroke_style = function(width, cap, linejoin, miterlimit) {
	if (typeof width !== "undefined" && width !== null) this.cc.lineWidth = width;
	// butt, round, square
	if (typeof cap !== "undefined" && cap !== null) this.cc.lineCap = cap;
	// bevel, round, miter
	if (typeof linejoin !== "undefined" && linejoin !== null) this.cc.lineJoin = linejoin;
	if (typeof miterlimit !== "undefined" && miterlimit !== null) this.cc.miterLimit = miterlimit;
};

suit.Graphics.prototype.set_font_style = function(font, align, baseline) {
	if (typeof font !== "undefined" && font !== null) this.cc.font = font;
	// start, left, center, right, end
	if (typeof align !== "undefined" && align !== null) this.cc.textAlign = align;
	// top, hanging, middle, alphabetic, ideographic, bottom
	if (typeof baseline !== "undefined" && baseline !== null) this.cc.textBaseline = baseline;
};

suit.Graphics.prototype.set_fill_stroke = function(fill, stroke) {
	if (fill) this.cc.fillStyle = fill;
	if (stroke) this.cc.strokeStyle = stroke;
};

suit.Graphics.prototype.save = function() {
	this.cc.save();
};

suit.Graphics.prototype.restore = function() {
	this.cc.restore();
};
suit.Error = function(msg) {
	this.message = msg;
};
suit.Error.prototype.name = "SUITError";

suit.log = function() {
	console.log.apply(console, arguments);
};

suit.info = function() {
	console.info.apply(console, arguments);
};

suit.warn = function() {
	console.warn.apply(console, arguments);
};

suit.error = function() {
	console.error.apply(console, arguments);
	throw new suit.Error(Array.prototype.join.call(arguments, " "));
};
suit.Widget = function() {
	suit.Object.call(this);
	this.parent = null;
	this.screen = null;
	this.event_mask = suit.Event.None;
};
suit.Widget.prototype = suit.Object.inherit();
suit.Widget.prototype.name = "Widget";

suit.Widget.prototype.set_allocation = function(allocation) {
	this.allocation = allocation;
};
suit.Widget.prototype.size_allocate = function(allocation) {
	this.set_allocation(allocation);
};

suit.Widget.prototype.get_allocation = function() {
	return this.allocation;
};
suit.Widget.prototype.draw = function(context) {};
suit.Widget.prototype.get_request_mode = function() {};
suit.Widget.prototype.get_preferred_width = function() {};
suit.Widget.prototype.get_preferred_height = function() {};
suit.Widget.prototype.get_preferred_width_for_height = function() {};
suit.Widget.prototype.get_preferred_height_for_width = function() {};

suit.Widget.prototype.queue_redraw = function() {
	if (this.parent) this.parent.queue_redraw();
};
suit.Widget.prototype.queue_resize = function() {
	if (this.parent) { 
		this.parent.queue_resize();
	}
};

suit.Widget.prototype.get_screen = function() {
	if (this.screen) return this.screen;
	var widget = this;
	while (widget.parent) {
		if (widget.parent instanceof suit.Screen) return widget.parent;
		widget = widget.parent;
	}
	return null;
};

suit.Widget.prototype.event_mask_add = function(bits) {
	this.event_mask |= bits;
};

suit.Widget.prototype.event_mask_sub = function(bits) {
	this.event_mask ^= bits;
};

suit.Widget.prototype.lock = function() {
	var screen = this.get_screen();
	if (screen.lock && screen.lock !== this) {
		suit.error("Events are already locked by #%s.", screen.lock.name);
		return false;
	}
	screen.lock = this;
	return true;
};

suit.Widget.prototype.unlock = function() {
	this.get_screen().lock = null;
};

suit.Widget.prototype.register_event = function(e) {

	var has_coords = e.type & (suit.Event.ButtonPress |
		suit.Event.ButtonRelease |
		suit.Event.ButtonDblPress |
		suit.Event.Scroll |
		suit.Event.Motion);
		
	var isown = true;
	if (has_coords) {
		e.x -= this.allocation.x;
		e.y -= this.allocation.y;
	}
	
	// First scan children
	if (this.children) {
	
		var child, ca;
		if (has_coords) {
			child = this.get_child_with_coords(e.x, e.y);
			if (child) {
				isown = child.register_event(e);
				e.x += child.allocation.x;
				e.y += child.allocation.y;
			}
		}
	
	}
	
	if (isown) {
		// First check if the event mask includes the event
		if (this.event_mask & e.type) {
			this.emit(e.name, e);
			return false;
		}
		return true;
	}
	
	return false;
};

suit.Widget.prototype.get_local_coordinates = function(x, y) {
	if (!this.allocation) return false;
	x -= this.allocation.x;
	y -= this.allocation.y;
	return [x, y];
};

suit.Widget.prototype.get_absolute_coordinates = function(x, y) {
	if (!this.allocation) return false;
	x += this.allocation.x;
	y += this.allocation.y;
	return [x, y];
};
suit.Image = function(filename) {
	suit.Widget.call(this);
	this.filename = filename;
	
	this.loaded = false;
	
	this.usedimage = suit.Image.broken_image;
	
	var imageobj = new Image();
	imageobj.src = filename;
	
	this.align = "center";
	this.valign = "middle";
	
	var self = this;
	imageobj.onload = function() {
		self.loaded = true;
		self.usedimage = this;
		self.queue_resize();
	};
};


suit.Image.broken_image = (function() {
	var img = new Image();
	img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAN8SURBVEiJtZXNa1xVGMZ/99xzP2YyY4pJNUFbQ40iZOXGjcuuhoK4k+7digSjbkQX4toJ+Be4E0FELHTtH6AgHZWxM8wkaTshk69Ocud+nfO6aO7NTBqhaekL7+Jc3vM893ne95zjiAjPM/TkwnGcAPCfETMVkaRciQgiQrvdXo3jeGiMkWfJOI6H7XZ7tcB1RATHcSpRFG0qpeastZOKnuiXJ21WSmGt3a1Wq1dEZFxYFHieN5em6RTo0/THGIPv+3NAAJQEjoiwtrZGq9W6MOhkrKyssL6+DuDAaZMdEaHValGv1x+zpvCzsE8pheM459a1Wq1C+RSBAtBaEwTB1EZjDG8Hwnt1l6s2BWBD+fwyMvyROLiuO0UwHo+ZwpxU4Hkevu+XBFmWcTPMuTHcgjvbDB2FweENMXyy+DK35l/lx1zjeV5J4HneuQoeI7DWspwecf3fv0hGRxyFId8sLnM3Fa4eHfLZ1oDr+w+5s7RCT1dQSl2MII5j3r3XI9s7ZEdpLo+O+fzSLt/Nv8bfvs/XScK3ewPeoc1vtQW01hhjGI1GGGNKAnWWIAiCsg8Lu0MGBj598Qp3Dehunw+32iykYzZqs2wZeOXgEBFBa43v+/i+XwzDFIGanPkoitje3mZ8HBPhEoUVvphdpGMUXv8+H+/dZ0mDQZGMEyYPZ9GLArtUYK0liiK63S6dToeDgwNa1qUejXnTyYmrM3x56SU6BvTmA1YHm1SPx7SsS5ZlxHFMHMckSXKuAscYQ7/fZ3d3lziOyfOcn4IqcZJxc6PPsmREYchXs5e5lwvOgx3i9FFNnuclQZqm5zfZGEOSJOUhEhG6lSrf+xU+GOzw0eiIw9oMKrfMWGGcG36YqdGtVAnyHGMMIkKaplMK9KRFaZqiVCEKrLX8Wp/lT0dx4/iY5YcRAL9rza3aC2zU6vjWkiSnt/P/EaiC/eR2nWpYN6zQ9Pxi/HBd91Ge7JmszbLs/CYDNBoNsiwjTdMysywrp6QALtSdV9toNJjELN6Da4PBoFOtVtFaP/E7cDZEhDzPiaKIhYWF10WkW1hke73ecGlpaf6pkM9Er9cbAhZOLRo0m83b/X5/33VdtNZorcurw/d9giAgDEPCMCQIgvK753llveu69Pv9/WazeRsYwIlFAI7jrADvA29NEF80LPAP8LOItKYInlf8BwLjX+eOMfEfAAAAAElFTkSuQmCC";
	return img;
})();

suit.Image.prototype = suit.Widget.inherit();
suit.Image.prototype.name = "Image";

suit.Image.prototype.draw = function(context) {
	var middlex = 0;
	var middley = 0;
	switch (this.align) {
	case "center": middlex = this.allocation.width/2 - this.usedimage.width/2;
		break;
	case "right": middlex = this.allocation.width - this.usedimage.width;
		break;
	}
	switch (this.valign) {
	case "middle": middley = this.allocation.height/2 - this.usedimage.height/2;
		break;
	case "bottom": middley = this.allocation.height - this.usedimage.height;
		break;
	}
	context.cc.drawImage(this.usedimage, middlex | 0, middley | 0);
	suit.log("Drew image");
};

suit.Image.prototype.set_align = function(align) {
	this.align = align;
	this.queue_redraw();
};

suit.Image.prototype.set_valign = function(valign) {
	this.valign = valign;
	this.queue_redraw();
};

suit.Image.prototype.get_request_mode = function() {
	return SizeRequestMode.HEIGHT_FOR_WIDTH; // TODO: Rotatable text labels
};

suit.Image.prototype.get_preferred_width = function() {
	var width = this.usedimage.width;
	return {
		minimum: width,
		natural: width
	};
};
suit.Image.prototype.get_preferred_height = function() {
	var height = this.usedimage.height;
	return {
		minimum: height,
		natural: height
	};
};
suit.Image.prototype.get_preferred_height_for_width = function(awidth) {
	var iheight = this.usedimage.height;
	var iwidth = this.usedimage.width;
	var height = awidth / iwidth * iheight;
	
	height = this.usedimage.height;
	return {
		minimum: height,
		natural: height
	};
};
suit.Image.prototype.get_preferred_width_for_height = function(aheight) {
	var iheight = this.usedimage.height;
	var iwidth = this.usedimage.width;
	var width = aheight / iheight * iwidth;
	
	width = this.usedimage.width;
	return {
		minimum: width,
		natural: width
	};
};
suit.Label = function(text) {
	suit.Widget.call(this);
	this.valign = "top"; // top, middle, bottom
	this.layout = new suit.TextLayout();
	//this.layout.set_font("Droid Sans", 16);
	this.layout.set_font(["Droid Sans", "sans-serif"], 16);
	
	var self = this;
	this.layout.connect("resize", function() {
		self.queue_resize();
	});
	if (text) {
		this.layout.set_text(text);
	}
};
suit.Label.prototype = suit.Widget.inherit();
suit.Label.prototype.name = "Label";

suit.Label.prototype.set_text = function(text) {
	this.layout.set_text(text);
	this.queue_redraw();
};

suit.Label.prototype.set_align = function(align) {
	this.layout.set_align (align);
	this.queue_redraw();
};

suit.Label.prototype.set_valign = function(valign) {
	this.valign = valign;
	this.queue_redraw();
};

suit.Label.prototype.set_line_height = function(line_height) {
	this.layout.set_line_height(line_height);
	this.queue_redraw();
};

suit.Label.prototype.draw = function(context) {

	var height, x, y;
	context.set_fill_stroke ("#fff");

	switch (this.valign) {
	case "top":
		y = this.allocation.y; break;
	case "middle":
		height = this.layout.get_preferred_height();
		y = (this.allocation.y + (this.allocation.height/2) - (height/2) - 1) | 0;
		break;
	case "bottom":
		height = this.layout.get_preferred_height();
		y = this.allocation.y + this.allocation.height - height - 1;
		break;
	}

	switch (this.layout.align) {
	case "left":
		x = this.allocation.x; break;
	case "center":
		x = (this.allocation.x + this.allocation.width/2 - 1) | 0; break;
	case "right":
		x = this.allocation.x + this.allocation.width - 1;
	}

	this.layout.render(context, x, y);
};

suit.Label.prototype.size_allocate = function(allocation) {
	suit.Widget.prototype.size_allocate.call(this, allocation);
	this.layout.set_width(allocation.width);
};

suit.Label.prototype.get_request_mode = function() {
	return SizeRequestMode.HEIGHT_FOR_WIDTH; // TODO: Rotatable text labels
};

suit.Label.prototype.get_preferred_width = function() {
	var width = this.layout.get_preferred_width();
	return {
		minimum: width,
		natural: width
	};
};
suit.Label.prototype.get_preferred_height = function() {
	var height = this.layout.get_preferred_height();
	return {
		minimum: height,
		natural: height
	};
};
suit.Label.prototype.get_preferred_height_for_width = function(width) {
	var height = this.layout.get_preferred_height_for_width(width);
	return {
		minimum: height,
		natural: height
	};
};
suit.Label.prototype.get_preferred_width_for_height = function(height) {
	var width = this.layout.get_preferred_width_for_height(height);
	return {
		minimum: width,
		natural: width
	};
};
suit.Container = function() {
	suit.Widget.call(this);
	this.children = [];
	this.connect("add", function() {
		if (this.allocation) {
			this.size_allocate(this.allocation);
		}
	});
};

suit.Container.prototype = suit.Widget.inherit();

suit.Container.prototype.name = "Container";

suit.Container.prototype.index_of = function(widget) {
	if( (index = this.children.indexOf(widget)) > -1 ) {
		return index;
	}
	return false;
};

suit.Container.prototype.add = function(widget) {
	this.children.push(widget);
	widget.parent = this;
	widget.screen = this.get_screen();

	this.emit('add');
	return true;
};

suit.Container.prototype.remove = function(widget) {
	var index;
	if (index = this.index_of(widget)) {
		this.children.splice(index, 1);
		return true;
	}
	return false;
};

suit.Container.prototype.remove_all = function() {
	for (var i = 0, len = this.children.length; i < len; i++) {
		this.children[i].parent = null;
		this.children[i].screen = null;
	}
	this.children = [];
};

suit.Container.prototype.replace = function(widget_or_index, new_widget) {
	var index;
	if (typeof widget_or_index === "number") {
		index = widget_or_index;
	} else {
		index = this.index_of(widget_or_index);
	}
	if (index >= this.children.length) {
		return this.add(new_widget);
	}
	new_widget.parent = this;
	new_widget.screen = this.get_screen();
	this.children[index] = new_widget;
	return true;
};

suit.Container.prototype.insert = function(index, new_widget) {
	if (index >= this.children.length) {
		return this.add(new_widget);
	}
	new_widget.parent = this;
	new_widget.screen = this.get_screen();
	this.children.splice(index, 0, new_widget);
	return true;
};

suit.Container.prototype.get_child_with_coords = function(x, y) {
	if (!this.children.length) return false;
	
	var child;
	for (var i = 0, len = this.children.length; i < len; i++) {
		child = this.children[i];
		if (!child.allocation) continue;
		if (x >= child.allocation.x &&
			x <= child.allocation.x + child.allocation.width &&
			y >= child.allocation.y &&
			y <= child.allocation.y + child.allocation.height) {
				return child;
		}
	}
	return false;
};
suit.Bin = function() {
	suit.Container.call(this);
	this.child = null;
};

suit.Bin.prototype = suit.Container.inherit();
suit.Bin.prototype.name = "Bin";

suit.Bin.prototype.set_child = function(widget) {

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

suit.ProgressBar.prototype.get_request_mode = function() {
	if (this.child) {
		return this.child.get_request_mode ();
	}
	return SizeRequestMode.HEIGHT_FOR_WIDTH;
};
suit.ProgressBar.prototype.get_preferred_width = function() {
	var padding = this.style.padding_left + this.style.padding_right;
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
suit.ProgressBar.prototype.get_preferred_height = function() {
	var padding = this.style.padding_top + this.style.padding_bottom;
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
suit.ProgressBar.prototype.get_preferred_width_for_height = function(height) {
	var padding = this.style.padding_left + this.style.padding_right;
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
suit.ProgressBar.prototype.get_preferred_height_for_width = function(width) {
	var padding = this.style.padding_top + this.style.padding_bottom;
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
suit.Scroller = function(child) {
	suit.Bin.call(this);
	
	this.scrollX = 0; // Distance from left of child to left of scroller. <= 0
	this.scrollY = 0; // Distance from top of child to top of scroller. <= 0
	
	this.event_mask =
		suit.Event.ButtonPress | suit.Event.ButtonRelease | suit.Event.Scroll;
	
	this.dragging = false;
	this.startDragX = null;
	this.startDragY = null;
	
	this.policyX = "never"; // "never", "always"
	this.policyY = "always";
	
	if (child) {
		this.set_child(child);
	}
	this.connect("event_button", this.on_event_button);
	this.connect("event_scroll", this.on_event_scroll);
	this.connect("event_motion", this.on_event_motion);

	this.style = {
		padding_top: 5,
		padding_bottom: 5,
		padding_left: 8,
		padding_right: 8
	};
};
suit.Scroller.prototype = suit.Bin.inherit();
suit.Scroller.prototype.name = "Scroller";

suit.Scroller.prototype.draw = function(context) {
	var a = this.allocation;
	
	/*context.set_shadow (0, 0, 5, "#000");
	context.set_fill_stroke ("#fff");
	context.rect(a.x, a.y, a.width, a.height);
	context.set_shadow();
	
	var gradhei = Math.min(a.y+a.height, a.y+20);
	context.set_fill_stroke (
		context.create_linear_gradient (a.x, a.y, a.x, gradhei,
		[
			[0, "#eee"],
			[1, "#fff"]
		]));
	context.rect(a.x, a.y+1, a.width, gradhei); */
	
	context.set_fill_stroke ("#000");
	context.rect(a.x, a.y, a.width, a.height);
	
	if (this.child) {
		this.draw_scrollbars(context);
	}
};

suit.Scroller.prototype.draw_scrollbars = function(context) {
	var a = this.allocation;
	var ca = this.child.get_allocation();
	
	context.set_stroke_style (4, "round");
	context.set_fill_stroke (null, "#333");
	
	if (this.policyY === "always") {
		var x = a.x + a.width - 5.5;
		var y = 6 + a.y + ((-this.scrollY) / ca.height * a.height);
		var h = a.height/ca.height*(a.height-12) - 12;
		context.path([
			[x, y],
			[x, y+h]
		]);
	}
	
	if (this.policyX === "always") {
		var y = a.y + a.height - 5.5;
		var x = 6 + a.x + ((-this.scrollX) / ca.width * a.width);
		var w = a.width/ca.width*(a.width-12) - 12;
		context.path([
			[x, y],
			[x+w, y]
		]);
	}
}

suit.Scroller.prototype.size_allocate = function(allocation) {
	suit.Widget.prototype.size_allocate.call(this, allocation);
	
	var cw, ch;
	if (this.child) {
		if (this.policyX === "never" && this.policyY === "always") {
			cw = allocation.width - this.style.padding_left - this.style.padding_right - 1;
			ch = this.child.get_preferred_height_for_width(cw).natural;
		} else if (this.policyX === "never" && this.policyY === "never") {
			cw = allocation.width - this.style.padding_left - this.style.padding_right - 1;
			ch = allocation.height - this.style.padding_top - this.style.padding_bottom - 1;
		} else if (this.policyX === "always" && this.policyY === "always") {
			cw = this.child.get_preferred_width().natural;
			ch = this.child.get_preferred_height().natural;
		} else if (this.policyX === "always" && this.policyY === "never") {
			ch = allocation.height - this.style.padding_top - this.style.padding_bottom - 1;
			cw = this.child.get_preferred_width_for_height(ch).natural;
		}
		this.child.size_allocate(new suit.Allocation(0, 0, cw, ch));
		this.update_scroll_position();
	}
};

suit.Scroller.prototype.update_scroll_position = function() {
	if (this.child) {
		var ca = this.child.get_allocation();
		var a = this.get_allocation();
		
		var max_scrollX = a.width - ca.width - this.style.padding_left - this.style.padding_right;
		var max_scrollY = a.height - ca.height - this.style.padding_bottom - this.style.padding_top;
		
		this.scrollX = this.scrollX > 0 ? 0 :
			(this.scrollX < max_scrollX ? max_scrollX : this.scrollX);
		this.scrollY = this.scrollY > 0 ? 0 :
			(this.scrollY < max_scrollY ? max_scrollY : this.scrollY);
		
		if (this.policyX === "never") this.scrollX = 0;
		if (this.policyY === "never") this.scrollY = 0;
		
		ca.x = this.style.padding_left + this.scrollX;
		ca.y = this.style.padding_top + this.scrollY;
		
		this.child.set_allocation(ca); // Use set_allocation here because we don't need to recalculate layout.
		this.queue_redraw();
	}
};

suit.Scroller.prototype.set_policy = function(horizontal, vertical) {
	this.policyX = horizontal || "never";
	this.policyY = vertical || "always";
};

suit.Scroller.prototype.on_event_scroll = function(e) {
	if (e.deltaY && this.policyY === "always") {
		this.scrollY += e.deltaY;
		this.update_scroll_position();
	}
	if (e.deltaX && this.policyX === "always") {
		this.scrollX += e.deltaX;
		this.update_scroll_position();
	}
};

suit.Scroller.prototype.on_event_button = function(e) {
	switch (e.type) {
	case suit.Event.ButtonPress:
		this.startDragX = e.x;
		this.startDragY = e.y;
		this.dragging = true;
		this.event_mask_add (suit.Event.Motion);
		this.lock();
		break;
	case suit.Event.ButtonRelease:
		if (this.dragging) {
			this.dragging = false;
			this.event_mask_sub (suit.Event.Motion);
			this.unlock();
		}
	}
};

suit.Scroller.prototype.on_event_motion = function(e) {
	if (this.dragging) {
		if (this.policyY === "always") {
			this.scrollY -= this.startDragY - e.y;
			this.startDragY = e.y;
		}
		if (this.policyX === "always") {
			this.scrollX -= this.startDragX - e.x;
			this.startDragX = e.x;
		}
		this.update_scroll_position();
	}
};

suit.Scroller.prototype.get_request_mode = function() {
	if (this.child) {
		return this.child.get_request_mode ();
	}
	return SizeRequestMode.HEIGHT_FOR_WIDTH;
};
suit.Scroller.prototype.get_preferred_width = function() {
	var preferred = new RequestedSize(1, 1);
	if (this.child) {
		preferred = this.child.get_preferred_width();
	}
	return preferred;
};
suit.Scroller.prototype.get_preferred_height = function() {
	var preferred = new suit.RequestedSize(1, 1);
	if (this.child) {
		preferred = this.child.get_preferred_height();
	}
	return preferred;
};
suit.Scroller.prototype.get_preferred_width_for_height = function(height) {
	var preferred = new suit.RequestedSize(1, 1);
	if (this.child) {
		preferred = this.child.get_preferred_width_for_height();
	}
	return preferred;
};
suit.Scroller.prototype.get_preferred_height_for_width = function(width) {
	var preferred = new suit.RequestedSize(1, 1);
	if (this.child) {
		preferred = this.child.get_preferred_height_for_width(width);
	}
	return preferred;
};
suit.Button = function(text) {
	suit.Bin.call(this);
	
	this.event_mask = suit.Event.ButtonPress;
	
	this.pressed = false;
	if (text) {
		this.set_child(new suit.Label(text));
		this.child.set_align ("center");
		this.child.set_valign ("middle");
	}
	this.connect("event_button", this.on_event_button);

	this.style = {
		padding_top: 6,
		padding_bottom: 6,
		padding_left: 8,
		padding_right: 8
	};
};
suit.Button.prototype = suit.Bin.inherit();
suit.Button.prototype.name = "Button";

suit.Button.prototype.draw = function(context) {
	var a = this.allocation;

	// TODO: Move this into a theme class
	/*context.set_shadow (0, 0, 5, "#000");
	context.rect(a.x, a.y, a.width, a.height);
		// Safari can't do shadows on shapes with gradients I guess
	context.set_shadow();*/

	var stops;
	if (!this.pressed) {
		stops = [
			[0, "#3f3f3f"],
			[1, "#2e2e2e"]
		];
	} else {
		stops = [
			[0, "#2e2e2e"],
			[1, "#3f3f3f"]
		];
	}

	context.set_fill_stroke (
		context.create_linear_gradient (a.x, a.y, a.x, a.y+a.height, stops),
		"#575757");
	context.rect(a.x, a.y, a.width, a.height);
	
	context.set_stroke_style (1, "butt", "miter");
	context.path([
		[a.x,           a.y + a.height - 1],
		[a.x,           a.y],
		[a.x + a.width - 1, a.y],
		[a.x + a.width - 1, a.y + a.height - 1]
	]);

	context.set_fill_stroke ("#ffffff", "#0b0b0b");
	context.path([
		[a.x + a.width - 1, a.y + a.height - 1],
		[a.x,           a.y + a.height - 1]
	]);

	// Demonstration purposes
	//context.set_shadow (1, 1, 1, "black");
	//this.child.draw(context);
	//context.set_font_style ("16px \"Droid Sans\", Cabin, sans-serif", "center", "middle");
	//var top = a.y+((a.height-1)/2);
	//context.text("Droid Sans", (a.x + (a.width-1)/2) |0, top+(this.pressed?1:0));
	//context.set_shadow ();
};

suit.Button.prototype.size_allocate = function(allocation) {
	suit.Widget.prototype.size_allocate.call(this, allocation);
	if (this.child) {
		this.child.size_allocate(new suit.Allocation(
			this.style.padding_left,
			this.style.padding_top + this.pressed,
			allocation.width - this.style.padding_left - this.style.padding_right - 1,
			allocation.height - this.style.padding_top - this.style.padding_bottom - 1
		));
	}
};

suit.Button.prototype.on_event_button = function(e) {
	switch (e.type) {
	case suit.Event.ButtonPress:
		this.pressed = true;
		this.event_mask_add(suit.Event.ButtonRelease);
		this.lock();
		this.size_allocate(this.allocation);
		this.queue_redraw();
		break;
	case suit.Event.ButtonRelease:
		if (this.pressed) {
			this.event_mask_sub(suit.Event.ButtonRelease);
			this.emit("activate");
			this.pressed = false;
			this.unlock();
			this.size_allocate(this.allocation);
			this.queue_redraw();
		}
	}
};

suit.Button.prototype.get_request_mode = function() {
	if (this.child) {
		return this.child.get_request_mode ();
	}
	return SizeRequestMode.HEIGHT_FOR_WIDTH;
};
suit.Button.prototype.get_preferred_width = function() {
	var padding = this.style.padding_left + this.style.padding_right;
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
suit.Button.prototype.get_preferred_height = function() {
	var padding = this.style.padding_top + this.style.padding_bottom;
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
suit.Button.prototype.get_preferred_width_for_height = function(height) {
	var padding = this.style.padding_left + this.style.padding_right;
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
suit.Button.prototype.get_preferred_height_for_width = function(width) {
	var padding = this.style.padding_top + this.style.padding_bottom;
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
suit.Screen = function() {
	suit.Bin.call(this);
	
	this.update_timer = null;
	this.throttling = false;
	
	// When set to a widget object, events are channeled directly to the widget
	this.lock = null;
	
	this.canvas = document.createElement("canvas");
	this.context = new suit.Graphics(this.canvas.getContext("2d"));
	
	this.container = document.createElement('div');
	this.container.style.position = "absolute";
	this.container.style.top = "0";
	this.container.style.left = "0";
	this.container.appendChild(this.canvas);
	
	document.body.style.overflow = "hidden";
	document.body.appendChild(this.container);
	
	this.resize();
	this.attach_dom_events();
	//this.attach_internal_events();
};

suit.Screen.prototype = suit.Bin.inherit();
suit.Screen.prototype.name = "Screen";

suit.Screen.prototype.queue_redraw = function() {
	if (this.update_timer) {
		clearTimeout(this.update_timer);
	}
	if (this.throttling)
		this.update_timer = setTimeout(this.draw.bind(this), 10);
	else
		this.draw();
};

suit.Screen.prototype.queue_resize = function() {
	this.resize();
};

suit.Screen.prototype.draw = function() {
	var context = this.context;
	var a = this.allocation;
	
	context.save();
	context.set_fill_stroke ("#191919");
	context.rect (0, 0, a.width, a.height);
	if (this.child) {
		this.draw_recursive(this.child, context);
	}
	context.restore();
};

suit.Screen.prototype.draw_recursive = function(widget, context) {
	var allocation = widget.get_allocation();
	if (allocation) {
		// Start with clipping the canvas to the allocation, so it doesn't spill
		context.push_clip.apply(context, allocation.args());
		// Draw the widget
		widget.draw(context);
		// Translate the coordinates to the widgets to the widgets top-left point
		context.cc.translate(allocation.x, allocation.y);
		// If the widget is a container
		if (widget.children) {
			// For each child:
			for (var i = 0, len = widget.children.length; i < len; i++) {
				// Check the bounds of the child
				//var ca = widget.get_allocation();
				//if (!ca) continue;
				//if (ca.y + ca.height >= 0 &&
				//	ca.x + ca.width >= 0 //&&
					//ca.y <= allocation.height &&
					//ca.x <= allocation.width
				//) {
					// Draw the child widget
					this.draw_recursive (widget.children[i], context);
				//}
			}
		}
		// Remove the clipping and translation
		context.pop_clip();
	}
};

suit.Screen.prototype.size_allocate = function(a) {
	suit.Widget.prototype.size_allocate.call(this, a);
	
	this.container.style.width = a.width + "px";
	this.container.style.height = a.height + "px";
	this.canvas.width = a.width;
	this.canvas.height = a.height;
	
	var w = Math.min(600, a.width-50);
	var h = Math.min(400, a.height-50);
	if (this.child) {
		this.child.size_allocate (new suit.Allocation (a.width/2-w/2, a.height/2-h/2, w, h));
	}
	//*/
	/*if (this.child) {
		this.child.size_allocate (a);
	}
	//*/
};

suit.Screen.prototype.resize = function() {
	var width = window.innerWidth;
	var height = window.innerHeight;
	
	this.size_allocate(new suit.Allocation(0, 0, width, height));
	this.draw(); // TODO: Change this to queue_resize
};

suit.Screen.prototype.attach_dom_events = function() {

	var on_resize = this.resize.bind(this);
	var on_mousedown = function(e) {
		var coords = this.get_mouse_coordinates(e);
		var widget = this.lock || this.get_child_with_coords(coords[0], coords[1]);
		if (widget) {
			widget.register_event(
				new suit.EventButton(
					suit.Event.ButtonPress,
					suit.Modifiers.None,
					this.get_button(e),
					coords[0], coords[1], 0
				));
		}
		e.stopPropagation();
		e.preventDefault();
		return false;
	}.bind(this);
	
	var on_mousemove_coords = [-1,-1];
	var on_mousemove = function(e) {
		var coords = this.get_mouse_coordinates(e);
		if (coords[0] === on_mousemove_coords[0] &&
			coords[1] === on_mousemove_coords[1]) {
			return;
		}
		on_mousemove_coords = coords;
		
		var widget = this.lock || this.get_child_with_coords(coords[0], coords[1]);
		if (widget) {
			widget.register_event(
				new suit.EventMotion(
					suit.Modifiers.None,
					coords[0], coords[1],
					0
				));
		}
		e.stopPropagation();
		e.preventDefault();
		return false;
	}.bind(this);
	
	var on_mouseup = function(e) {
		var coords = this.get_mouse_coordinates(e);
		var widget = this.lock || this.get_child_with_coords(coords[0], coords[1]);
		if (widget) {
			widget.register_event(
				new suit.EventButton(
					suit.Event.ButtonRelease,
					suit.Modifiers.None,
					this.get_button(e),
					coords[0], coords[1], 0
				));
		}
		e.stopPropagation();
		e.preventDefault();
		return false;
	}.bind(this);
	
	var on_mousewheel = function(e) {
		var coords = this.get_mouse_coordinates(e);
		var widget = this.lock || this.get_child_with_coords(coords[0], coords[1]);
		
		var deltaX = 0, deltaY = 0;
		if (e.wheelDelta) {
			if (e.wheelDeltaX || e.wheelDeltaY) {
				deltaX = e.wheelDeltaX;
				deltaY = e.wheelDeltaY;
			} else {
				deltaY = e.wheelDelta;
			}
		} else if (e.axis === e.HORIZONTAL_AXIS) {
			deltaX = -e.detail;
		} else if (e.axis === e.VERTICAL_AXIS) {
			deltaY = -e.detail;
		}
		
		if (deltaX === 0 && deltaY === 0) return false;
		
		if (widget) {
			widget.register_event(
				new suit.EventScroll(
					suit.Modifiers.None,
					coords[0], coords[1],
					deltaX, deltaY, 0
				));
		}
		e.stopPropagation();
		e.preventDefault();
		return false;
	}.bind(this);
	
	var on_contextmenu = function(e) {
		e.stopPropagation();
		e.preventDefault();
		return false;
	};
	
	addEventListener("resize", on_resize, false);
	addEventListener("mousedown", on_mousedown, false);
	addEventListener("mouseup", on_mouseup, false);
	addEventListener("MozMousePixelScroll", on_mousewheel, false);
	addEventListener("mousewheel", on_mousewheel, false);
	addEventListener("mousemove", on_mousemove, false);
	addEventListener("contextmenu", on_contextmenu, false);
};

//suit.Screen.prototype.attach_internal_events = function() {};

suit.Screen.prototype.get_button = function(e) {
	var right_click = false;
	if (e.which) rightclick = (e.which == 3);
	else if (e.button) rightclick = (e.button == 2);
	return right_click ? 3 : 1;
};

suit.Screen.prototype.get_mouse_coordinates = function(e) {
	var x = 0;
	var y = 0;
	if (e.pageX || e.pageY) { 
		x = e.pageX;
		y = e.pageY;
	} else { 
		x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
		y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
	}
	
	var obj = this.canvas;
	var offsetLeft = obj.offsetLeft;
	var offsetTop = obj.offsetTop;
	while (obj.offsetParent) {
		if (obj === document.body) break;
		offsetLeft += obj.offsetParent.offsetLeft;
		offsetTop += obj.offsetParent.offsetTop;
		obj = obj.offsetParent;
	}
	x -= offsetLeft;
	y -= offsetTop;

	return [x, y];
}
suit.Packer = function(orientation) {
	suit.Container.call(this);

	this.orientation = orientation || "horizontal"; // "horizontal" or "vertical"
	this.align = "start"; // "start", "end" or "middle"
	this.spacing = 20;
	this.style = {
		padding_top: 0,
		padding_bottom: 0,
		padding_left: 0,
		padding_right: 0
	};

};
suit.Packer.prototype = suit.Container.inherit();
suit.Packer.prototype.name = "Packer";

suit.Packer.prototype.set_spacing = function(spacing) {
	this.spacing = spacing;
	if (this.allocation) this.size_allocate (this.allocation);
};

suit.Packer.prototype.get_spacing = function() {
	return this.spacing;
};

suit.Packer.prototype.size_allocate = function(allocation) {
	suit.Widget.prototype.size_allocate.call(this, allocation);
	
	var majorsize, minorsize;
	if (this.orientation === "horizontal") {
		majorsize = (this.orientation === "horizontal") ?
			allocation.width : allocation.height;
		minorsize = (this.orientation === "horizontal") ?
			allocation.height : allocation.width;
	} else {
		majorsize = (this.orientation === "horizontal") ?
			allocation.height : allocation.width;
		minorsize = (this.orientation === "horizontal") ?
			allocation.width : allocation.height;
	}
	
	var childsize = 0;
	var childsize_parts = [];
	
	for (var i = 0, len = this.children.length; i < len; i++) {
		var child = this.children[i];
		var majchild = (this.orientation === "horizontal") ?
			child.get_preferred_width_for_height(minorsize).natural :
			child.get_preferred_height_for_width(majorsize).natural

		childsize += majchild;
		if (i !== 0) { childsize += this.spacing; }
		childsize_parts.push(majchild);
	}
	
	/*if (childsize > majorsize) {
		for (var i = 0, len = childsize_parts.length; i < len; i++) {
			childsize_parts[i] *= (majorsize/childsize);
		}
	}*/
	
	var majpos = 0;
	
	for (var i = 0, len = this.children.length; i < len; i++) {
		var child = this.children[i];
		var ca;
		if (i !== 0) { majpos += this.spacing; }
		if (this.orientation === "horizontal") {
			ca = new suit.Allocation(
				majpos, 0, childsize_parts[i], allocation.height);
		} else {
			ca = new suit.Allocation(
				0, majpos, allocation.width, childsize_parts[i]);
		}
		child.size_allocate(ca);
		majpos += childsize_parts[i];
	}
};

suit.Packer.prototype.get_request_mode = function() {
	return SizeRequestMode.HEIGHT_FOR_WIDTH;
};

suit.Packer.prototype.get_preferred_width = function() {
	var minimum = 0;
	var natural = 0;
	
	for (var i = 0, len = this.children.length; i < len; i++) {
		var child = this.children[i];
		var size = child.get_preferred_width();
		minimum += size.minimum;
		natural += size.natural;
	}
	
	minimum += this.spacing * (len-1);
	natural += this.spacing * (len-1);
	
	return {
		minimum: minimum,
		natural: natural
	};
};

suit.Packer.prototype.get_preferred_height = function() {
	var minimum = 0;
	var natural = 0;
	
	for (var i = 0, len = this.children.length; i < len; i++) {
		var child = this.children[i];
		var size = child.get_preferred_height();
		minimum += size.minimum;
		natural += size.natural;
	}
	
	minimum += this.spacing * (len-1);
	natural += this.spacing * (len-1);
	
	return {
		minimum: minimum,
		natural: natural
	};
};

suit.Packer.prototype.get_preferred_width_for_height = function(height) {
	var minimum = 0;
	var natural = 0;
	
	if (this.orientation === "horizontal") {
		for (var i = 0, len = this.children.length; i < len; i++) {
			var child = this.children[i];
			var size = child.get_preferred_width_for_height(height);
			minimum += size.minimum;
			natural += size.natural;
		}
	
		minimum += this.spacing * (len-1);
		natural += this.spacing * (len-1);
	} else {
		for (var i = 0, len = this.children.length; i < len; i++) {
			var child = this.children[i];
			var size = child.get_preferred_width_for_height(height);
			minimum = (size.minimum > minimum) ? size.minimum : minimum;
			natural = (size.natural > natural) ? size.natural : natural;
		}
	}
	
	return {
		minimum: minimum,
		natural: natural
	};
};

suit.Packer.prototype.get_preferred_height_for_width = function(width) {
	var minimum = 0;
	var natural = 0;
	
	if (this.orientation === "horizontal") {
		for (var i = 0, len = this.children.length; i < len; i++) {
			var child = this.children[i];
			var size = child.get_preferred_height_for_width(width);
			minimum = (size.minimum > minimum) ? size.minimum : minimum;
			natural = (size.natural > natural) ? size.natural : natural;
		}
	} else {
		for (var i = 0, len = this.children.length; i < len; i++) {
			var child = this.children[i];
			var size = child.get_preferred_height_for_width(width);
			minimum += size.minimum;
			natural += size.natural;
		}
	
		minimum += this.spacing * (len-1);
		natural += this.spacing * (len-1);
	}
	
	return {
		minimum: minimum,
		natural: natural
	};
};
