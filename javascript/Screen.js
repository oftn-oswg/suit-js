var Screen = function(parentnode) {
	Bin.call(this);
	
	this.update_timer = null;
	this.throttling = true;
	
	var w, h;
	
	this.width = w = parentnode.offsetWidth;
	this.height = h = parentnode.offsetHeight;
	
	this.canvas = document.createElement("canvas");
	if (!this.canvas.getContext) {
		alert("Your browser does not have canvas support.");
		return false;
	}
	this.context = new Graphics(this.canvas.getContext("2d"));
	
	while (parentnode.hasChildNodes()) {
		parentnode.removeChild(parentnode.lastChild);
	}
	parentnode.appendChild(this.canvas);
	
	this.canvas.width = w;
	this.canvas.height = h;
	
	
	this.canvas.onmousedown = function(e) {
		var coords = SUIT.get_mouse_coordinates(this.canvas, e);
		if (coords[0] >= this.child.allocation.x &&
			coords[0] <= this.child.allocation.x + this.child.allocation.width &&
			coords[1] >= this.child.allocation.y &&
			coords[1] <= this.child.allocation.y + this.child.allocation.height) {
			this.child.pressed = true;
			this.child.queue_redraw();
		}
	}.bind(this);
	this.canvas.onmouseup = function() {
		if (this.child.pressed) {
			this.child.pressed = false;
			this.child.queue_redraw();
			this.child.emit("activate");
		}
	}.bind(this);

};
Screen.prototype = SUIT.construct_prototype(Bin);
Screen.prototype.set_child = function(widget) {
	Bin.prototype.set_child.call(this, widget);
	//this.child.set_allocation (new Allocation (5, 5, this.width-10, this.height-10));
	this.child.set_allocation (new Allocation (this.width/2-75, this.height/2-18, 150, 36));
	this.queue_redraw();
};

Screen.prototype.queue_redraw = function() {
	if (this.update_timer) {
		clearTimeout(this.update_timer);
	}
	if (this.throttling)
		this.update_timer = setTimeout(this.draw.bind(this), 50);
	else
		this.draw();
};

Screen.prototype.draw = function() {
	var context = this.context;
	
	context.save();
	context.set_fill_stroke ("#191919");
	context.rect (0, 0, this.width, this.height);
	this.child.draw (context);
	context.restore();
};
