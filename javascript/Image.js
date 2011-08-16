suit.Image = function SUITImage(filename) {
	suit.ensure(filename, "string");
	
	suit.Widget.call(this);
	this.filename = filename;
	
	var imageobj = document.createElement("img");
	imageobj.src = filename;
	
	var self = this;
	imageobj.onload = function() {
		self.loaded = true;
		self.usedimage = this;
		self.queue_resize();
	};
};


suit.Image.broken_image = (function() {
	var img = new Image();
	img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAN8SURBVEiJtZXNa1xVGMZ/99xzP2YyY4pJNUFbQ40iZOXGjcuuhoK4k+7digSjbkQX4toJ+Be4E0FELHTtH6AgHZWxM8wkaTshk69Ocud+nfO6aO7NTBqhaekL7+Jc3vM893ne95zjiAjPM/TkwnGcAPCfETMVkaRciQgiQrvdXo3jeGiMkWfJOI6H7XZ7tcB1RATHcSpRFG0qpeastZOKnuiXJ21WSmGt3a1Wq1dEZFxYFHieN5em6RTo0/THGIPv+3NAAJQEjoiwtrZGq9W6MOhkrKyssL6+DuDAaZMdEaHValGv1x+zpvCzsE8pheM459a1Wq1C+RSBAtBaEwTB1EZjDG8Hwnt1l6s2BWBD+fwyMvyROLiuO0UwHo+ZwpxU4Hkevu+XBFmWcTPMuTHcgjvbDB2FweENMXyy+DK35l/lx1zjeV5J4HneuQoeI7DWspwecf3fv0hGRxyFId8sLnM3Fa4eHfLZ1oDr+w+5s7RCT1dQSl2MII5j3r3XI9s7ZEdpLo+O+fzSLt/Nv8bfvs/XScK3ewPeoc1vtQW01hhjGI1GGGNKAnWWIAiCsg8Lu0MGBj598Qp3Dehunw+32iykYzZqs2wZeOXgEBFBa43v+/i+XwzDFIGanPkoitje3mZ8HBPhEoUVvphdpGMUXv8+H+/dZ0mDQZGMEyYPZ9GLArtUYK0liiK63S6dToeDgwNa1qUejXnTyYmrM3x56SU6BvTmA1YHm1SPx7SsS5ZlxHFMHMckSXKuAscYQ7/fZ3d3lziOyfOcn4IqcZJxc6PPsmREYchXs5e5lwvOgx3i9FFNnuclQZqm5zfZGEOSJOUhEhG6lSrf+xU+GOzw0eiIw9oMKrfMWGGcG36YqdGtVAnyHGMMIkKaplMK9KRFaZqiVCEKrLX8Wp/lT0dx4/iY5YcRAL9rza3aC2zU6vjWkiSnt/P/EaiC/eR2nWpYN6zQ9Pxi/HBd91Ge7JmszbLs/CYDNBoNsiwjTdMysywrp6QALtSdV9toNJjELN6Da4PBoFOtVtFaP/E7cDZEhDzPiaKIhYWF10WkW1hke73ecGlpaf6pkM9Er9cbAhZOLRo0m83b/X5/33VdtNZorcurw/d9giAgDEPCMCQIgvK753llveu69Pv9/WazeRsYwIlFAI7jrADvA29NEF80LPAP8LOItKYInlf8BwLjX+eOMfEfAAAAAElFTkSuQmCC";
	return img;
})();

suit.Image.inherit (suit.Widget);

// Default instance variables
suit.Image.prototype.name = "Image";
suit.Image.prototype.loaded = false;
suit.Image.prototype.usedimage = suit.Image.broken_image;
suit.Image.prototype.align = "center";
suit.Image.prototype.valign = "middle";


suit.Image.prototype.draw = function(graphics) {
	suit.ensure(graphics, suit.Graphics);
	
	var middlex = 0;
	var middley = 0;
	switch (this.align) {
	case "center": middlex = this.allocation.width/2 - this.usedimage.width/2;
		break;
	case "right": middlex = this.allocation.width - this.usedimage.width;
		break;
	}
	switch (this.valign) {
	case "middle": middley = this.allocation.height/2 - this.usedimage.height/2;
		break;
	case "bottom": middley = this.allocation.height - this.usedimage.height;
		break;
	}
	graphics.context.drawImage(this.usedimage, middlex | 0, middley | 0);
	return this;
};

suit.Image.prototype.set_align = function(align) {
	suit.ensure(align, "string");
	
	this.align = align;
	this.queue_redraw();
	return this;
};

suit.Image.prototype.set_valign = function(valign) {
	suit.ensure(valign, "string");
	
	this.valign = valign;
	this.queue_redraw();
	return this;
};

suit.Image.prototype.get_request_mode = function() {
	return SizeRequestMode.HEIGHT_FOR_WIDTH; // TODO: Rotatable text labels
};

suit.Image.prototype.get_preferred_width = function() {
	var width = this.usedimage.width;
	return {
		minimum: width,
		natural: width
	};
};
suit.Image.prototype.get_preferred_height = function() {
	var height = this.usedimage.height;
	return {
		minimum: height,
		natural: height
	};
};
suit.Image.prototype.get_preferred_height_for_width = function(awidth) {
	var iheight = this.usedimage.height;
	var iwidth = this.usedimage.width;
	var height = awidth / iwidth * iheight;
	
	height = this.usedimage.height;
	return {
		minimum: height,
		natural: height
	};
};
suit.Image.prototype.get_preferred_width_for_height = function(aheight) {
	var iheight = this.usedimage.height;
	var iwidth = this.usedimage.width;
	var width = aheight / iheight * iwidth;
	
	width = this.usedimage.width;
	return {
		minimum: width,
		natural: width
	};
};
