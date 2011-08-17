"use strict";

var suit = {};

// When set to a suit.Window object, events are channeled directly to it.
suit.lock = null;

suit.widgets = []; // Mapping of unique id's to widgets

suit.unique = (function() {
	var unique = 1;
	return function() {
		return unique++;
	};
})();

suit.register = function(widget, event, event_dom) {

	if (widget.event && widget.event (event)) {
		event_dom.stopPropagation();
		event_dom.preventDefault();
		return false;
	}

	return true;
};

suit.DomEvent = {
	MouseDown:    1,
	MouseUp:      2,
	MouseMove:    4,
	MouseWheel:   8,
	ContextMenu: 16,
	TouchStart:  32,
	TouchEnd:    64,
	TouchMove:  128
};


suit.get_relevant_widget = function(event, mask, no_lock) {
	var target, widget;

	if (!no_lock && suit.lock) return suit.lock;

	target = event.target || event.srcElement;
	if (target.nodeType === 3) target = target.parentNode;

	do {
		if (!target.suit_unique) return null;

		widget = suit.widgets[target.suit_unique];
		if (widget.event_mask & mask) break;

		if (target.suit_empty) target = target.parentNode.firstChild;
		else target = target.parentNode.parentNode.firstChild;

	} while (target);

	return widget;
};


suit.get_event_position = function(event, target) {
	var x, y, box;
	
	x = 0;
	y = 0;

	if (event.pageX || event.pageY) {
		x = event.pageX;
		y = event.pageY;
	} else if (event.clientX || event.clientY) {
		x = event.clientX + document.body.scrollLeft
			+ document.documentElement.scrollLeft;
		y = event.clientY + document.body.scrollTop
			+ document.documentElement.scrollTop;
	}

	box = target.getBoundingClientRect();
	x -= box.top;
	y -= box.left;

	return {x: x, y: y};
};


suit.get_event_button = function(event) {
	var right_click;
	
	right_click = false;
	if (event.which) right_click = (event.which == 3);
	else if (event.button) right_click = (event.button == 2);
	return right_click ? 3 : 1;
};


suit.do_event = function(type, event) {
	var widget, target, pos, stype;

	switch (type) {
	case suit.DomEvent.MouseDown:
	case suit.DomEvent.MouseUp:

		stype = (type === suit.DomEvent.MouseDown) ?
			suit.Event.ButtonPress :
			suit.Event.ButtonRelease;

		widget = suit.get_relevant_widget (event, stype);
		if (!widget) return true;

		target = widget.window.base;
		pos = suit.get_event_position (event, target);
		button = suit.get_event_button (event);
		
		return suit.register (
			widget,
			new suit.EventButton (
				stype,
				suit.Modifiers.None,
				button, pos.x, pos.y, -1),
			event);

		break;

	case suit.DomEvent.MouseMove:
	
		widget = suit.get_relevant_widget (event, suit.Event.Motion);
		if (!widget) return true;

		target = widget.window.base;
		pos = suit.get_event_position (event, target);

		return suit.register (
			widget,
			new suit.EventMotion (
				suit.Modifiers.None,
				pos.x, pos.y, -1),
			event);

		break;

	case suit.DomEvent.MouseWheel:

		var deltaX = 0, deltaY = 0;

		if (event.wheelDelta) {
			if (event.wheelDeltaX || event.wheelDeltaY) {
				deltaX = event.wheelDeltaX;
				deltaY = event.wheelDeltaY;
			} else {
				deltaY = event.wheelDelta;
			}
		} else if (event.axis === event.HORIZONTAL_AXIS) {
			deltaX = -event.detail;
		} else if (event.axis === event.VERTICAL_AXIS) {
			deltaY = -event.detail;
		}
		
		if (deltaX === 0 && deltaY === 0) return false;

		widget = suit.get_relevant_widget (event, suit.Event.Scroll);
		if (!widget) return true;
		
		target = widget.window.base;
		pos = suit.get_event_position (event, target);

		return suit.register (
			widget,
			new suit.EventScroll (
				suit.Modifiers.None,
				pos.x, pos.y, deltaX, deltaY, -1),
			event);

		break;

	default:
		suit.warn ("Unhandled event: "+type);
		
	}
};

suit.init = function() {

	addEventListener("mousedown", function(event) {
		return suit.do_event(suit.DomEvent.MouseDown, event || window.event);
	}, false);

	addEventListener("mouseup", function(event) {
		return suit.do_event(suit.DomEvent.MouseUp, event || window.event);
	}, false);

	addEventListener("MozMousePixelScroll", function(event) {
		return suit.do_event(suit.DomEvent.MouseWheel, event || window.event);
	}, false)

	addEventListener("mousewheel", function(event) {
		return suit.do_event(suit.DomEvent.MouseWheel, event || window.event);
	}, false);
;
	addEventListener("mousemove", function(event) {
		return suit.do_event(suit.DomEvent.MouseMove, event || window.event);
	}, false);

	addEventListener("touchstart", function(event) {
		return suit.do_event (suit.DomEvent.TouchStart, event || window.event);
	}, false);

	addEventListener("touchend", function(event) {
		return suit.do_event (suit.DomEvent.TouchEnd, event || window.event);
	}, false);

	addEventListener("touchmove", function(event) {
		return suit.do_event (suit.DomEvent.TouchMove, event || window.event);
	}, false);

	addEventListener("contextmenu", function(event) {

		// TODO: Only do this if we're not on a suit window

		event.stopPropagation();
		event.preventDefault();
		return false;
	}, false);

};

suit.ensure = function(variable, expect) {
	var type = typeof variable;
	
	if (Array.isArray(expect)) {
		return;
	}
	
	if (typeof expect === "string") {
		if (type !== expect) {
			throw new Error("Failed type check. Was expecting `"+expect+"` but got `"+type+"`.");
		}
	} else if (typeof expect === "function") {
		var hrtype = type;
		if (type === "object") {
			hrtype = "object of " +
				(variable.constructor.name?variable.constructor.name:"[object Function]");
		} 
		if (!(variable instanceof expect)) {
			throw new Error("Failed type check. Was expecting instance of `" +
				(expect.name?expect.name:"[object Function]")+"` but got `"+hrtype+"`.");
		}
	}
};

//addEventListener("error", function(e){ console.log(e.stack); }, 0);

Function.prototype.inherit = (function() {
	if (typeof Object.create === "function") {
		return function(base) {
			this.prototype = Object.create(base.prototype, {
				constructor: {
					value: this,
					enumerable: false,
					writable: true,
					configurable: true
				}
			});
		};
	}

	if (typeof Object.defineProperties === "function") {
		return function(base) {
			var dummy = function() {};
			dummy.prototype = base.prototype;
			
			this.prototype = new dummy;
			Object.defineProperties(this.prototype, {
				constructor: {
					value: this,
					enumerable: false,
					writable: true,
					configurable: true
				}
			});
		};
	}
	
	return function(base) {
		var dummy = function() {};
		dummy.prototype = base.prototype;
		
		this.prototype = new dummy;
		this.prototype.constructor = this;
	};
})();

if (!Function.prototype.bind) {
	Function.prototype.bind = function( obj ) {
		var slice = [].slice,
			args = slice.call(arguments, 1),
			self = this,
			nop = function () {},
			bound = function () {
				return self.apply( this instanceof nop ? this : ( obj || {} ), 
					args.concat( slice.call(arguments) ) );
			};
		nop.prototype = self.prototype;
		bound.prototype = new nop();
		return bound;
	};
}

if (!Array.isArray) {
	Array.isArray = function(o) {
		return Object.prototype.toString.call(o) === "[object Array]";
	};
}
