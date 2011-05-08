suit.Screen = function(parentnode) {
	suit.Bin.call(this);
	
	this.update_timer = null;
	this.throttling = true;
	
	// When set to a widget object, events are channeled directly to the widget
	this.lock = null;
	
	this.width = parentnode.offsetWidth;
	this.height = parentnode.offsetHeight;
	
	this.canvas = document.createElement("canvas");
	this.context = new suit.Graphics(this.canvas.getContext("2d"));
	
	while (parentnode.firstChild) {
		parentnode.removeChild(parentnode.firstChild);
	}
	parentnode.appendChild(this.canvas);
	
	this.canvas.width = this.width;
	this.canvas.height = this.height;
	
	this.attach_events();
};

suit.Screen.prototype = suit.Bin.inherit();

suit.Screen.prototype.set_child = function(widget) {
	suit.Bin.prototype.set_child.call(this, widget);
	//this.child.set_allocation (new suit.Allocation (5, 5, this.width-10, this.height-10));
	var w = 200;
	var h = 400;
	this.child.set_allocation (new suit.Allocation (this.width/2-w/2, this.height/2-h/2, w, h));
	this.queue_redraw();
};

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
	
	context.save();
	context.set_fill_stroke ("#191919");
	context.rect (0, 0, this.width, this.height);
	this.child.draw (context);
	context.restore();
};

suit.Screen.prototype.attach_events = function() {

	this.canvas.addEventListener("mousedown", function(e) {
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
	}.bind(this), false);
	
	this.canvas.addEventListener("mouseup", function(e) {
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
	}.bind(this);
	
	this.canvas.addEventListener("MozMousePixelScroll", mouse_scroll_func, false);
	this.canvas.addEventListener("mousewheel", mouse_scroll_func, false);
	
	var last_mousemove_coords = [-1,-1];
	this.canvas.addEventListener("mousemove", function(e) {
	
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
	}.bind(this), false);
};

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
