suit.Packer = function SUITPacker(orientation) {
	suit.ensure(orientation, "string");
	suit.Container.call(this);

	this.orientation = orientation || "horizontal"; // "horizontal" or "vertical"
	this.style = {
		padding_top: 0,
		padding_bottom: 0,
		padding_left: 0,
		padding_right: 0
	};
};
suit.Packer.inherit (suit.Container);

// Default instance variables
suit.Packer.prototype.name = "Packer";
suit.Packer.prototype.align = "start"; // "start", "end" or "middle"
suit.Packer.prototype.spacing = 20;

suit.Packer.prototype.set_spacing = function(spacing) {
	suit.ensure(spacing, "number");
	this.spacing = spacing;
	if (this.allocation) this.size_allocate (this.allocation);
	return this;
};

suit.Packer.prototype.get_spacing = function() {
	return this.spacing;
};

suit.Packer.prototype.size_allocate = function(allocation) {
	suit.ensure(allocation, suit.Allocation);
	suit.Widget.prototype.size_allocate.call(this, allocation);
	
	var majorsize, minorsize;
	if (this.orientation === "horizontal") {
		majorsize = (this.orientation === "horizontal") ?
			allocation.width : allocation.height;
		minorsize = (this.orientation === "horizontal") ?
			allocation.height : allocation.width;
	} else {
		majorsize = (this.orientation === "horizontal") ?
			allocation.height : allocation.width;
		minorsize = (this.orientation === "horizontal") ?
			allocation.width : allocation.height;
	}
	
	var childsize = 0;
	var childsize_parts = [];
	
	for (var i = 0, len = this.children.length; i < len; i++) {
		var child = this.children[i];
		var majchild = (this.orientation === "horizontal") ?
			child.get_preferred_width_for_height(minorsize).natural :
			child.get_preferred_height_for_width(majorsize).natural

		childsize += majchild;
		if (i !== 0) { childsize += this.spacing; }
		childsize_parts.push(majchild);
	}
	
	/*if (childsize > majorsize) {
		for (var i = 0, len = childsize_parts.length; i < len; i++) {
			childsize_parts[i] *= (majorsize/childsize);
		}
	}*/
	
	var majpos = 0;
	
	for (var i = 0, len = this.children.length; i < len; i++) {
		var child = this.children[i];
		var ca;
		if (i !== 0) { majpos += this.spacing; }
		if (this.orientation === "horizontal") {
			ca = new suit.Allocation(
				majpos, 0, childsize_parts[i], allocation.height);
		} else {
			ca = new suit.Allocation(
				0, majpos, allocation.width, childsize_parts[i]);
		}
		child.size_allocate(ca);
		majpos += childsize_parts[i];
	}
	return this;
};

suit.Packer.prototype.get_request_mode = function() {
	return SizeRequestMode.HEIGHT_FOR_WIDTH;
};

suit.Packer.prototype.get_preferred_width = function() {
	var minimum = 0;
	var natural = 0;
	
	for (var i = 0, len = this.children.length; i < len; i++) {
		var child = this.children[i];
		var size = child.get_preferred_width();
		minimum += size.minimum;
		natural += size.natural;
	}
	
	minimum += this.spacing * (len-1);
	natural += this.spacing * (len-1);
	
	return {
		minimum: minimum,
		natural: natural
	};
};

suit.Packer.prototype.get_preferred_height = function() {
	var minimum = 0;
	var natural = 0;
	
	for (var i = 0, len = this.children.length; i < len; i++) {
		var child = this.children[i];
		var size = child.get_preferred_height();
		minimum += size.minimum;
		natural += size.natural;
	}
	
	minimum += this.spacing * (len-1);
	natural += this.spacing * (len-1);
	
	return {
		minimum: minimum,
		natural: natural
	};
};

suit.Packer.prototype.get_preferred_width_for_height = function(height) {
	suit.ensure(height, "number");
	
	var minimum = 0;
	var natural = 0;
	
	if (this.orientation === "horizontal") {
		for (var i = 0, len = this.children.length; i < len; i++) {
			var child = this.children[i];
			var size = child.get_preferred_width_for_height(height);
			minimum += size.minimum;
			natural += size.natural;
		}
	
		minimum += this.spacing * (len-1);
		natural += this.spacing * (len-1);
	} else {
		for (var i = 0, len = this.children.length; i < len; i++) {
			var child = this.children[i];
			var size = child.get_preferred_width_for_height(height);
			minimum = (size.minimum > minimum) ? size.minimum : minimum;
			natural = (size.natural > natural) ? size.natural : natural;
		}
	}
	
	return {
		minimum: minimum,
		natural: natural
	};
};

suit.Packer.prototype.get_preferred_height_for_width = function(width) {
	suit.ensure(width, "number");
	
	var minimum = 0;
	var natural = 0;
	
	if (this.orientation === "horizontal") {
		for (var i = 0, len = this.children.length; i < len; i++) {
			var child = this.children[i];
			var size = child.get_preferred_height_for_width(width);
			minimum = (size.minimum > minimum) ? size.minimum : minimum;
			natural = (size.natural > natural) ? size.natural : natural;
		}
	} else {
		for (var i = 0, len = this.children.length; i < len; i++) {
			var child = this.children[i];
			var size = child.get_preferred_height_for_width(width);
			minimum += size.minimum;
			natural += size.natural;
		}
	
		minimum += this.spacing * (len-1);
		natural += this.spacing * (len-1);
	}
	
	return {
		minimum: minimum,
		natural: natural
	};
};
