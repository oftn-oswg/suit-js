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
