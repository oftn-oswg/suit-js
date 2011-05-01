var Screen = function(parentnode) {
	Bin.call(this);
	
	this.update_timer = null;
	
	var w, h;
	
	this.width = w = parentnode.offsetWidth;
	this.height = h = parentnode.offsetHeight;
	
	this.canvas = document.createElement("canvas");
	if (!this.canvas.getContext) {
		alert("Your browser does not have canvas support.");
		return false;
	}
	this.context = this.canvas.getContext("2d");
	
	while (parentnode.hasChildNodes()) {
		parentnode.removeChild(parentnode.lastChild);
	}
	parentnode.appendChild(this.canvas);
	
	this.canvas.width = w;
	this.canvas.height = h;

};
Screen.prototype = SUIT.construct_prototype(Bin);
Screen.prototype.set_child = function(widget) {
	Bin.prototype.set_child.call(this, widget);
	this.child.set_allocation (new Allocation (this.width, this.height));
	this.invalidate();
};

Screen.prototype.invalidate = function() {
	if (this.update_timer) {
		clearTimeout(this.update_timer);
	}
	this.update_timer = setTimeout(this.draw.bind(this), 100);
};

Screen.prototype.draw = function() {
	console.log("Drawing child");
	var context = this.context;
	context.save();
	
	context.fillStyle = "rgb(225,225,255)";
	context.fillRect (0, 0, this.width, this.height);
	
	this.child.draw ();
	
	context.restore();
};
