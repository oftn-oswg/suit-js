suit.IFrame = function SUITIFrame(url) {
	suit.Widget.call(this);

	this.set_has_window (true);

	this.dom = document.createElementNS("http://www.w3.org/1999/xhtml", "iframe");
	this.dom.setAttribute ("frameborder", "0");

	if (url) this.set_url (url);
};

suit.inherit (suit.IFrame, suit.Widget);

// Default instance variables
suit.IFrame.prototype.name = "IFrame";

suit.IFrame.prototype.realize = function() {
	suit.Widget.prototype.realize.call (this, true);

	this.window.base.appendChild (this.dom);
};

suit.IFrame.prototype.unrealize = function() {
	this.window.base.removeChild (this.dom);

	suit.Widget.prototype.unrealize.call (this);
};

suit.IFrame.prototype.size_allocate = function(allocation) {
	suit.Widget.prototype.size_allocate.call (this, allocation);
	this.dom.style.width = allocation.width + "px";
	this.dom.style.height = allocation.height + "px";
};

suit.IFrame.prototype.set_url = function(url) {
	this.dom.src = url;
};

suit.IFrame.prototype.get_request_mode = function() {
	return SizeRequestMode.HEIGHT_FOR_WIDTH; // TODO: Rotatable text labels
};

suit.IFrame.prototype.get_preferred_width = function() {
	var width, realized, ostyle, ow, oh;

	if (this.cache_pref_width !== null) {
		width = this.cache_pref_width;
	} else {

		realized = this.realized;
		ostyle = this.window.base.style;

		if (!realized) {
			ostyle.display = "block";
		} else {
			ow = ostyle.width;
			oh = ostyle.height;
		}

		ostyle.height = "auto";
		ostyle.width = "auto";

		width = this.cache_pref_width = this.window.base.offsetWidth + 1;

		if (!realized) {
			ostyle.display = "none";
		} else {
			ostyle.width = ow;
			ostyle.height = oh;
		}
	}

	return {
		minimum: width,
		natural: width
	};
};

suit.IFrame.prototype.get_preferred_height = function() {
	var height, realized, ostyle, ow, oh;

	if (this.cache_pref_height !== null) {
		height = this.cache_pref_height;
	} else {

		realized = this.realized;
		ostyle = this.window.base.style;

		if (!realized) {
			ostyle.display = "block";
		} else {
			ow = ostyle.width;
			oh = ostyle.height;
		}

		ostyle.height = "auto";
		ostyle.width = "auto";

		height = this.cache_pref_height = this.window.base.offsetHeight + 1;

		if (!realized) {
			ostyle.display = "none";
		} else {
			ostyle.width = ow;
			ostyle.height = oh;
		}
	}

	return {
		minimum: height,
		natural: height
	};
};



suit.IFrame.prototype.get_preferred_height_for_width = function(width) {
	var height, realized, ostyle, ow, oh;

	if (this.cache_pref_hfw[width] != null) {
		height = this.cache_pref_hfw[width];
	} else {

		realized = this.realized;
		ostyle = this.window.base.style;

		if (!realized) {
			ostyle.display = "block";
		} else {
			ow = ostyle.width;
			oh = ostyle.height;
		}

		ostyle.height = "auto";
		ostyle.width = width+"px";

		height = this.cache_pref_hfw[width] = this.window.base.offsetHeight + 1;

		if (!realized) {
			ostyle.display = "none";
		} else {
			ostyle.width = ow;
			ostyle.height = oh;
		}
	}

	return {
		minimum: height,
		natural: height
	};
};


suit.IFrame.prototype.get_preferred_width_for_height = function(height) {
	var width, realized, ostyle, ow, oh;

	if (this.cache_pref_wfh[height] != null) {
		width = this.cache_pref_wfh[height];
	} else {

		realized = this.realized;
		ostyle = this.window.base.style;

		if (!realized) {
			ostyle.display = "block";
		} else {
			ow = ostyle.width;
			oh = ostyle.height;
		}

		ostyle.height = height+"px";
		ostyle.width = "auto";

		width = this.cache_pref_wfh[height] = this.window.base.offsetWidth + 1;

		if (!realized) {
			ostyle.display = "none";
		} else {
			ostyle.width = ow;
			ostyle.height = oh;
		}
	}

	return {
		minimum: width,
		natural: width
	};
};
