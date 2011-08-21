suit.Graphics = function SUITGraphics(context) {
	this.context = context;

	context.mozImageSmoothingEnabled = true;
}

suit.Graphics.prototype.rect = function(x, y, w, h, stroke, fill) {
	var context = this.context;

	if (typeof stroke === "undefined" || stroke === null) stroke = false;
	if (typeof fill === "undefined" || fill === null) fill = true;

	if (fill) context.fillRect (x, y, w, h);
	if (stroke) context.strokeRect (x, y, w, h);
};


suit.Graphics.prototype.clip = function(x, y, w, h) {
	var context = this.context;

	context.beginPath();
	context.rect (x, y, w, h);
	context.clip();
};


suit.Graphics.prototype.path = function(data, closepath, stroke, fill) {
	var context, delta;

	if (typeof closepath === "undefined" || closepath === null) closepath = false;
	if (typeof stroke === "undefined" || stroke === null) stroke = true;
	if (typeof fill === "undefined" || fill === null) fill = false;

	context = this.context;
	delta = context.lineWidth / 2 % 1;

	context.beginPath();
	for (var i = 0, len = data.length; i < len; i++) {
		if (!i) {
			context.moveTo((data[i][0]|0)+delta, (data[i][1]|0)+delta);
		} else {
			context.lineTo((data[i][0]|0)+delta, (data[i][1]|0)+delta);
		}
	}
	if (closepath) context.closePath();
	if (stroke) context.stroke();
	if (fill) context.fill();
};

suit.Graphics.prototype.set_shadow = function(offsetX, offsetY, blur, color) {
	var context;

	context = this.context;

	// Call with no arguments to remove shadow
	if (arguments.length) {
		if (typeof offsetX !== "undefined" && offsetX !== null) context.shadowOffsetX = offsetX;
		if (typeof offsetY !== "undefined" && offsetY !== null) context.shadowOffsetY = offsetY;
		if (typeof blur !== "undefined" && blur !== null) context.shadowBlur = blur;
		if (typeof color !== "undefined" && color !== null) context.shadowColor = color;
	} else {
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
		context.shadowBlur = 0;
		context.shadowColor = "transparent";
	}
};

suit.Graphics.prototype.create_linear_gradient = function(x, y, x2, y2, data) {
	var context, gradient;

	context = this.context;
	gradient = context.createLinearGradient(x, y, x2, y2);

	for (var i = 0, len = data.length; i < len; i++) {
		gradient.addColorStop (data[i][0], data[i][1]);
	}
	return gradient;
};

suit.Graphics.prototype.set_stroke_style = function(width, cap, linejoin, miterlimit) {
	var context;

	context = this.context;

	if (typeof width !== "undefined" && width !== null) context.lineWidth = width;
	// butt, round, square
	if (typeof cap !== "undefined" && cap !== null) context.lineCap = cap;
	// bevel, round, miter
	if (typeof linejoin !== "undefined" && linejoin !== null) context.lineJoin = linejoin;
	if (typeof miterlimit !== "undefined" && miterlimit !== null) context.miterLimit = miterlimit;
};

suit.Graphics.prototype.set_font_style = function(font, align, baseline) {
	var context;

	context = this.context;

	if (typeof font !== "undefined" && font !== null) context.font = font;
	// start, left, center, right, end
	if (typeof align !== "undefined" && align !== null) context.textAlign = align;
	// top, hanging, middle, alphabetic, ideographic, bottom
	if (typeof baseline !== "undefined" && baseline !== null) context.textBaseline = baseline;
};

suit.Graphics.prototype.set_fill_stroke = function(fill, stroke) {
	var context;

	context = this.context;

	if (fill) context.fillStyle = fill;
	if (stroke) context.strokeStyle = stroke;
};

suit.Graphics.prototype.clear = function() {
	var canvas;
	
	canvas = this.context.canvas;
	this.clear_area (0, 0, canvas.width, canvas.height);
};

suit.Graphics.prototype.clear_area = function(x, y, w, h) {
	var context;

	context = this.context;
	context.clearRect (x, y, w, h);
};

suit.Graphics.prototype.translate = function(x, y) {
	this.context.translate (x | 0, y | 0);
};

suit.Graphics.prototype.save = function() {
	this.context.save();
};

suit.Graphics.prototype.restore = function() {
	this.context.restore();
};
