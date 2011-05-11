suit.Screen = function() {
	suit.Bin.call(this);
	
	this.update_timer = null;
	this.throttling = true;
	
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
		context.push_clip.apply(context, allocation.args());
		widget.draw(context);
		context.cc.translate(allocation.x, allocation.y);
		if (widget.children) {
			for (var i = 0, len = widget.children.length; i < len; i++) {
				this.draw_recursive (widget.children[i], context);
			}
		}
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

	addEventListener("resize", this.resize.bind(this), false);

	addEventListener("mousedown", function(e) {
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
	}.bind(this), false);
	
	addEventListener("mouseup", function(e) {
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
	}.bind(this), false);
	
	var mouse_scroll_func = function(e) {
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
	
	addEventListener("MozMousePixelScroll", mouse_scroll_func, false);
	addEventListener("mousewheel", mouse_scroll_func, false);
	
	var last_mousemove_coords = [-1,-1];
	addEventListener("mousemove", function(e) {
	
		var coords = this.get_mouse_coordinates(e);
		if (coords[0] === last_mousemove_coords[0] &&
			coords[1] === last_mousemove_coords[1]) {
			return;
		}
		last_mousemove_coords = coords;
		
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
	}.bind(this), false);
	
	addEventListener("contextmenu", function(e) {
		e.stopPropagation();
		e.preventDefault();
		return false;
	}, false);
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
