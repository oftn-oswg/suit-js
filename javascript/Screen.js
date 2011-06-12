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
	suit.ensure(widget, suit.Widget);
	suit.ensure(context, suit.Graphics);
	
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
	suit.ensure(a, suit.Allocation);
	
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
					coords[0], coords[1], -1
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
					coords[0], coords[1], -1
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
					coords[0], coords[1], -1
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
					deltaX, deltaY, -1
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
	
	var on_touchstart = function(e) {
		var ch = e.changedTouches;
		for (var i = 0, len = ch.length; i < len; i++) {
			var coords = this.get_mouse_coordinates(ch[i]);
			var widget = this.lock || this.get_child_with_coords(coords[0], coords[1]);
			if (widget) {
				widget.register_event(
					new suit.EventButton(
						suit.Event.ButtonPress,
						suit.Modifiers.None,
						this.get_button(ch[i]),
						coords[0], coords[1], ch[i].identifier
					));
			}
		}
		e.stopPropagation();
		e.preventDefault();
		return false;
	}.bind(this);
	
	var on_touchmove = function(e) {
		var ch = e.changedTouches;
		for (var i = 0, len = ch.length; i < len; i++) {
			var coords = this.get_mouse_coordinates(ch[i]).reverse();
			var widget = this.lock || this.get_child_with_coords(coords[0], coords[1]);
			if (widget) {
				widget.register_event(
					new suit.EventMotion(
						suit.Modifiers.None,
						this.get_button(ch[i]),
						coords[0], coords[1], ch[i].identifier
					));
			}
		}
		e.stopPropagation();
		e.preventDefault();
		return false;
	}.bind(this);
	
	var on_touchend = function(e) {
		var ch = e.changedTouches;
		for (var i = 0, len = ch.length; i < len; i++) {
			var coords = this.get_mouse_coordinates(ch[i]);
			var widget = this.lock || this.get_child_with_coords(coords[0], coords[1]);
			if (widget) {
				widget.register_event(
					new suit.EventButton(
						suit.Event.ButtonRelease,
						suit.Modifiers.None,
						this.get_button(ch[i]),
						coords[0], coords[1], ch[i].identifier
					));
			}
		}
		e.stopPropagation();
		e.preventDefault();
		return false;
	}.bind(this);
	
	addEventListener("resize", on_resize, false);
	addEventListener("mousedown", on_mousedown, false);
	addEventListener("mouseup", on_mouseup, false);
	addEventListener("MozMousePixelScroll", on_mousewheel, false);
	addEventListener("mousewheel", on_mousewheel, false);
	addEventListener("mousemove", on_mousemove, false);
	addEventListener("contextmenu", on_contextmenu, false);
	
	addEventListener("touchstart", on_touchstart, false);
	addEventListener("touchmove", on_touchmove, false);
	addEventListener("touchend", on_touchend, false);
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
	
	/*var obj = this.canvas;
	var offsetLeft = obj.offsetLeft;
	var offsetTop = obj.offsetTop;
	while (obj.offsetParent) {
		if (obj === document.body) break;
		offsetLeft += obj.offsetParent.offsetLeft;
		offsetTop += obj.offsetParent.offsetTop;
		obj = obj.offsetParent;
	}
	x -= offsetLeft;
	y -= offsetTop; //*/

	return [x, y];
}
