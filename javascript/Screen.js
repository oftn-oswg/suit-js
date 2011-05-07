suit.Screen = function(parentnode) {
	suit.Bin.call(this);
	
	this.update_timer = null;
	this.throttling = true;
	this.lock = null; // When set to a widget object, events are channeled directly to the widget
	
	var w, h;
	
	this.width = w = parentnode.offsetWidth;
	this.height = h = parentnode.offsetHeight;
	
	this.canvas = document.createElement("canvas");
	if (!this.canvas.getContext) {
		alert("Your browser does not have canvas support.");
		return false;
	}
	this.context = new suit.Graphics(this.canvas.getContext("2d"));
	
	while (parentnode.hasChildNodes()) {
		parentnode.removeChild(parentnode.lastChild);
	}
	parentnode.appendChild(this.canvas);
	
	this.canvas.width = w;
	this.canvas.height = h;
	
	
	this.canvas.onmousedown = function(e) {
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
	}.bind(this);
	this.canvas.onmouseup = function(e) {
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
	}.bind(this);

};
suit.Screen.prototype = suit.Bin.inherit();
suit.Screen.prototype.set_child = function(widget) {
	suit.Bin.prototype.set_child.call(this, widget);
	//this.child.set_allocation (new suit.Allocation (5, 5, this.width-10, this.height-10));
	this.child.set_allocation (new suit.Allocation (this.width/2-75, this.height/2-18, 150, 36));
	this.queue_redraw();
};

suit.Screen.prototype.queue_redraw = function() {
	if (this.update_timer) {
		clearTimeout(this.update_timer);
	}
	if (this.throttling)
		this.update_timer = setTimeout(this.draw.bind(this), 50);
	else
		this.draw();
};

suit.Screen.prototype.draw = function() {
	var context = this.context;
	
	//console.log("Executing redraw");
	
	context.save();
	context.set_fill_stroke ("#191919");
	context.rect (0, 0, this.width, this.height);
	this.child.draw (context);
	context.restore();
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
