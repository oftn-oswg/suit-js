var Screen = function(parentnode) {
	Bin.call(this);
	
	this.update_timer = null;
	this.throttling = false;
	
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
	
	
	this.canvas.onmousedown = function() {
		this.child.pressed = true;
		this.child.invalidate();
	}.bind(this);
	this.canvas.onmouseup = function() {
		this.child.pressed = false;
		this.child.invalidate();
	}.bind(this);

};
Screen.prototype = SUIT.construct_prototype(Bin);
Screen.prototype.set_child = function(widget) {
	Bin.prototype.set_child.call(this, widget);
	//this.child.set_allocation (new Allocation (0, 0, this.width, this.height));
	this.child.set_allocation (new Allocation (25, 25, 80, 25));
	this.invalidate();
};

Screen.prototype.invalidate = function() {
	if (this.update_timer) {
		clearTimeout(this.update_timer);
	}
	if (this.throttling)
		this.update_timer = setTimeout(this.draw.bind(this), 100);
	else
		this.draw();
};

Screen.prototype.draw = function() {
	console.log("Drawing child");
	var context = this.context;
	
	context.save();
	
	context.set_fill_stroke ("#191919");
	context.rect (0, 0, this.width, this.height);
	
	this.child.draw ();
	
	context.restore();
};
