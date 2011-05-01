var Button = function() {
	Bin.call(this);
	this.pressed = false;
};
Button.prototype = SUIT.construct_prototype(Bin);

Button.prototype.draw = function() {
	var context = this.context;
	var a = this.allocation;
	
	// TODO: Move this into a theme class
	context.shadowOffsetX = 0;
	context.shadowOffsetY = 0;
	context.shadowBlur = 5;
	context.shadowColor = "#000";
	
	var gradient = context.createLinearGradient(a.x, a.y, a.x, a.y+a.height);
	if (!this.pressed) {
		gradient.addColorStop(0, '#3f3f3f');
		gradient.addColorStop(1, '#2e2e2e');
	} else {
		gradient.addColorStop(0, '#2e2e2e');
		gradient.addColorStop(1, '#3f3f3f');
	}
	
	context.fillStyle = gradient;
	context.fillRect(a.x, a.y, a.width, a.height);
	
	
	context.shadowOffsetX = 0;
	context.shadowOffsetY = 0;
	context.shadowBlur = 0;
	context.shadowColor = "transparent";
	
	context.strokeStyle = "#575757";
	context.lineWidth = 1;
	context.lineCap = "butt";
	context.beginPath();
	context.moveTo(a.x, a.y+a.height);
	context.lineTo(a.x, a.y);
	context.lineTo(a.x+a.width, a.y);
	context.lineTo(a.x+a.width, a.y+a.height);
	context.stroke();
	
	context.strokeStyle = "#0b0b0b";
	context.beginPath();
	context.moveTo(a.x+a.width, a.y+a.height);
	context.lineTo(a.x, a.y+a.height);
	context.stroke();
	
	// Demonstration purposes
	context.fillStyle = "#fff";
	context.font = "16px Cabin";
	context.textAlign = "center";
	context.textBaseline = "top";
	
	context.fillText("Button", (a.x + a.width/2) |0, a.y+1+(this.pressed?1:0));
	//#0b0b0b
};

Button.prototype.get_request_mode = function() {
	if (this.child) {
		return this.child.get_request_mode ();
	}
	return SizeRequestMode.HEIGHT_FOR_WIDTH;
};
Button.prototype.get_preferred_width = function() {
	var preferred = new RequestedSize(12, 12); // Button padding * 2
	if (this.child) {
		var childpref = this.child.get_preferred_width();
		preferred.mininum += childpref.minimum;
		preferred.natural += childpref.natural;
	}
	return preferred;
};
Button.prototype.get_preferred_height = function() {
	var preferred = new RequestedSize(12, 12); // Button padding * 2
	if (this.child) {
		var childpref = this.child.get_preferred_height();
		preferred.mininum += childpref.minimum;
		preferred.natural += childpref.natural;
	}
	return preferred;
};
Button.prototype.get_preferred_width_for_height = function(height) {
	var preferred = new RequestedSize(12, 12); // Button padding * 2
	if (this.child) {
		var childpref = this.child.get_preferred_height();
		preferred.mininum += childpref.minimum;
		preferred.natural += childpref.natural;
	}
	return preferred;
};
Button.prototype.get_preferred_height_for_width = function(width) {
	var preferred = new RequestedSize(12, 12); // Button padding * 2
	if (this.child) {
		var childpref = this.child.get_preferred_height();
		preferred.mininum += childpref.minimum;
		preferred.natural += childpref.natural;
	}
	return preferred;
};

