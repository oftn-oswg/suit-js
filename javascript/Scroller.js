suit.Scroller = (function() {
	"use strict";

	// We need to know the width of the browser's native scrollbar
	// to layout children with an accurate allocation.
	var native_scrollbar_width = (function() {
		// Create the measurement node
		var div = document.createElement("div");
		div.style.width = "100px";
		div.style.height = "100px";
		div.style.overflow = "scroll";
		div.style.position = "absolute";
		div.style.top = "-9999px";
		document.documentElement.appendChild(div);

		// Get the scrollbar width
		var width = div.offsetWidth - div.clientWidth;
		document.documentElement.removeChild(div);
		return width;
	}());

	function SUITScroller(child) {
		suit.Bin.call(this);
		
		this.scrollX = 0; // Distance from left of child to left of scroller. <= 0
		this.scrollY = 0; // Distance from top of child to top of scroller. <= 0
		
		this.dragging = false;
		this.startDragX = null;
		this.startDragY = null;
		
		this.policyX = "never"; // "never", "always"
		this.policyY = "always";
		
		if (child) {
			suit.ensure(child, suit.Widget);
			this.set_child(child);
		}

		this.style = {
			padding_top: 0,
			padding_bottom: 0,
			padding_left: 0,
			padding_right: 0
		};

		this.animation = new suit.Animation;
		this.fade_out_timer = null;
		
		//this.event_mask =
			/*suit.Event.ButtonPress | suit.Event.ButtonRelease | suit.Event.Scroll */;
	};
	suit.inherit (SUITScroller, suit.Bin);

	SUITScroller.prototype.name = "Scroller";
	SUITScroller.prototype.opacity = 0;

	SUITScroller.prototype.realize = function(empty) {
		suit.Widget.prototype.realize.call(this, empty);

		this.set_policy (this.policyX, this.policyY);
	};

	SUITScroller.prototype.draw = function(graphics) {
		suit.ensure(graphics, suit.Graphics);
		
		var a = this.allocation;
		
		//graphics.set_fill_stroke ("#000");
		//graphics.rect(0, 0, a.width, a.height);
			
		if (this.child) {
			this.propagate_draw (this.child, graphics);
			//this.draw_scrollbars (graphics);
		}
	};

	/*
	SUITScroller.prototype.fade_to = function(to, time) {
		var self = this;

		if (this.opacity !== to) {
			this.animation.start(time, this.opacity, to, function(opacity) {
				opacity = (opacity * 100 | 0) / 100;
				self.opacity = opacity;
				self.scrollbar_redraw();
			});
		};
	};
	//*/

	/*
	SUITScroller.prototype.scrollbar_redraw = function() {
		var a = this.allocation;
		var sb_width = this.style.scroll_bar_width;

		if (this.policyX === "never" && this.policyY === "always") {
			this.queue_redraw_area (a.width - sb_width, 0, sb_width, a.height);
		} else if (this.policyX === "never" && this.policyY === "never") {
			// We a'int got no scroll bars
		} else if (this.policyX === "always" && this.policyY === "always") {
			this.queue_redraw ();
		} else if (this.policyX === "always" && this.policyY === "never") {
			this.queue_redraw_area (0, a.height - sb_width, a.width, sb_width);
		}
	};
	//*/

	/*
	SUITScroller.prototype.draw_scrollbars = function(graphics) {
		suit.ensure(graphics, suit.Graphics);

		var a, ca, sb_width, sb_width_half, sb_width_double;
		
		a = this.allocation;
		ca = this.child.get_allocation();

		sb_width = this.style.scroll_bar_width;
		sb_width_half = sb_width >> 1;
		sb_width_double = sb_width << 1;
		
		graphics.set_stroke_style (sb_width, "round");
		graphics.set_fill_stroke (null, "rgba(0,0,0,"+this.opacity+")");
		
		if (this.policyY === "always") {
			var x = a.width - sb_width_half;
			var y = sb_width_half + ((-this.scrollY) / ca.height * a.height);
			var h = a.height / ca.height * (a.height - sb_width) - sb_width;
			graphics.path([
				[x, y],
				[x, y+h]
			]);
		}
		
		if (this.policyX === "always") {
			var y = a.height - sb_width_half;
			var x = sb_width_half + ((-this.scrollX) / ca.width * a.width);
			var w = a.width / ca.width * (a.width - sb_width) - sb_width;
			graphics.path([
				[x, y],
				[x+w, y]
			]);
		}
	}
	//*/

	SUITScroller.prototype.size_allocate = function(allocation) {
		suit.ensure(allocation, suit.Allocation);
		
		suit.Widget.prototype.size_allocate.call(this, allocation);

		var sb_width = 0; //this.style.scroll_bar_width;
		
		var cw, ch;
		if (this.child) {
			if (this.policyX === "never" && this.policyY === "always") {
				cw = allocation.width - this.style.padding_left - this.style.padding_right - 1 - native_scrollbar_width;
				ch = this.child.get_preferred_height_for_width(cw).natural;
			} else if (this.policyX === "never" && this.policyY === "never") {
				cw = allocation.width - this.style.padding_left - this.style.padding_right - 1;
				ch = allocation.height - this.style.padding_top - this.style.padding_bottom - 1;
			} else if (this.policyX === "always" && this.policyY === "always") {
				cw = this.child.get_preferred_width().natural - native_scrollbar_width;
				ch = this.child.get_preferred_height().natural - native_scrollbar_width;
			} else if (this.policyX === "always" && this.policyY === "never") {
				ch = allocation.height - this.style.padding_top - this.style.padding_bottom - 1 - native_scrollbar_width;
				cw = this.child.get_preferred_width_for_height(ch).natural;
			}
			this.child.size_allocate(new suit.Allocation(0, 0, cw, ch));
			//this.update_scroll_position ();
		}
	};

	/*
	SUITScroller.prototype.update_scroll_position = function() {
		if (this.child) {
			var ca = this.child.get_allocation();
			var a = this.get_allocation();
			
			var max_scrollX = a.width - ca.width - this.style.padding_left - this.style.padding_right;
			var max_scrollY = a.height - ca.height - this.style.padding_bottom - this.style.padding_top;
			
			this.scrollX = this.scrollX > 0 ? 0 :
				(this.scrollX < max_scrollX ? max_scrollX : this.scrollX);
			this.scrollY = this.scrollY > 0 ? 0 :
				(this.scrollY < max_scrollY ? max_scrollY : this.scrollY);
			
			if (this.policyX === "never") this.scrollX = 0;
			if (this.policyY === "never") this.scrollY = 0;
			
			ca.x = this.style.padding_left + this.scrollX;
			ca.y = this.style.padding_top + this.scrollY;
			
			this.child.set_allocation(ca); // Use set_allocation here because we don't need to recalculate layout.
			if (!this.child.has_window) this.queue_redraw();
			this.scrollbar_redraw ();
		}
	};
	//*/

	SUITScroller.prototype.set_policy = function(horizontal, vertical) {
		suit.ensure(horizontal, ["string", "undefined"]);
		suit.ensure(vertical, ["string", "undefined"]);
		
		this.policyX = horizontal || "never";
		this.policyY = vertical || "always";

		if (this.window) {
			var overflowX, overflowY;
			switch (this.policyX) {
				case "auto":   overflowX = "auto"; break;
				case "never":  overflowX = "none"; break;
				case "always": overflowX = "scroll"; break;
			}
			switch (this.policyY) {
				case "auto":   overflowY = "auto"; break;
				case "never":  overflowY = "none"; break;
				case "always": overflowY = "scroll"; break;
			}
			//this.window.base.style.overflow = overflowY;
			this.window.base.style.overflowX = overflowX;
			this.window.base.style.overflowY = overflowY;
		}
	};

	SUITScroller.prototype.event = function(event) {
		var self = this, update;

		switch (event.type) {
		case suit.Event.Scroll:

			this.fade_to (1, 100);

			if (this.fade_out_timer) {
				clearTimeout (this.fade_out_timer);
				this.fade_out_timer = null;
			}

			this.fade_out_timer = setTimeout (function() {
				self.fade_to (0, 500);
			}, 350);

			update = false;

			if (event.deltaY && this.policyY === "always") {
				this.scrollY += event.deltaY;
				update = true;
			}
			if (event.deltaX && this.policyX === "always") {
				this.scrollX += event.deltaX;
				update = true;
			}

			if (update) this.update_scroll_position();
			break;

		case suit.Event.ButtonPress:

			this.startDragX = event.x;
			this.startDragY = event.y;
			this.dragging = true;
			this.event_mask_add (suit.Event.Motion);
			this.lock();
			break;

		case suit.Event.ButtonRelease:

			if (this.dragging) {
				this.dragging = false;
				this.event_mask_sub (suit.Event.Motion);
				this.unlock();
			}
			break;

		case suit.Event.Motion:

			if (this.dragging) {
				if (this.policyY === "always") {
					this.scrollY -= this.startDragY - event.y;
					this.startDragY = event.y;
				}
				if (this.policyX === "always") {
					this.scrollX -= this.startDragX - event.x;
					this.startDragX = event.x;
				}
				this.update_scroll_position();
			}
			break;

		default:
			suit.log("Unknown event "+event.type);
		}
		return true;
	};

	SUITScroller.prototype.get_request_mode = function() {
		if (this.child) {
			return this.child.get_request_mode ();
		}
		return SizeRequestMode.HEIGHT_FOR_WIDTH;
	};
	SUITScroller.prototype.get_preferred_width = function() {
		var preferred = new RequestedSize(1, 1);
		if (this.child) {
			preferred = this.child.get_preferred_width();
		}
		return preferred;
	};
	SUITScroller.prototype.get_preferred_height = function() {
		var preferred = new suit.RequestedSize(1, 1);
		if (this.child) {
			preferred = this.child.get_preferred_height();
		}
		return preferred;
	};
	SUITScroller.prototype.get_preferred_width_for_height = function(height) {
		suit.ensure(height, "number");
		
		var preferred = new suit.RequestedSize(1, 1);
		if (this.child) {
			preferred = this.child.get_preferred_width_for_height();
		}
		return preferred;
	};
	SUITScroller.prototype.get_preferred_height_for_width = function(width) {
		suit.ensure(width, "number");
		
		var preferred = new suit.RequestedSize(1, 1);
		if (this.child) {
			preferred = this.child.get_preferred_height_for_width(width);
		}
		return preferred;
	};

	return SUITScroller;
}());
