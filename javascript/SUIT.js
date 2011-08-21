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
		event_dom.stopPropagation && event_dom.stopPropagation();
		event_dom.preventDefault && event_dom.preventDefault();
		return false;
	}

	return true;
};


suit.get_relevant_widget = function(event, mask, no_lock) {
	var target, widget;

	if (!no_lock && suit.lock) return suit.lock;

	target = event.target || event.srcElement;
	if (target.nodeType === 3) target = target.parentNode;

	do {
		if (!target.suit_unique) return null;

		widget = suit.widgets[target.suit_unique];
		if (widget.event_mask & mask || mask === suit.Event.None) break;

		if (target.suit_empty) {
			target = target.parentNode.firstChild;
		} else {
			target = target.parentNode.parentNode.firstChild;
		}

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
		x = event.clientX + document.documentElement.scrollLeft;
		y = event.clientY + document.documentElement.scrollTop;
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

suit.register_button = function(event, type) {
	var widget, target, pos, button;

	widget = suit.get_relevant_widget (event, type);
	if (!widget) return true;

	target = widget.window.base;
	pos = suit.get_event_position (event, target);
	button = suit.get_event_button (event);
	
	return suit.register (
		widget,
		new suit.EventButton (
			type,
			suit.Modifiers.None,
			button, pos.x, pos.y, -1),
		event);
};


suit.register_mousemove = function(event) {
	var widget, target, pos;
	
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
};


suit.register_mousewheel = function(event) {
	var widget, target, pos, deltaX, deltaY;

	deltaX = 0;
	deltaY = 0;

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
};


suit.initialized = false;
suit.init = function() {

	var style, sheet, nsuri;

	if (suit.initialized) { return; }
	suit.initialized = true;

	nsuri = "http://www.w3.org/1999/xhtml";
	style = document.createElementNS (nsuri, "style");
	style.type = "text/css";
	document.documentElement.appendChild (style);

	sheet = style.sheet;
	sheet.insertRule (".suit { position: absolute; overflow: hidden; font: 16px \"Droid Sans\", \"Segoe UI\", \"Lucide Grande\", \"DejaVu Sans\", \"Bitstream Vera Sans\", \"sans-serif\";  }", 0);

	addEventListener("mousedown", function(event) {
		return suit.register_button (event, suit.Event.ButtonPress);
	}, false);

	addEventListener("mouseup", function(event) {
		return suit.register_button (event, suit.Event.ButtonRelease);
	}, false);

	addEventListener("mousewheel", suit.register_mousewheel, false);
	addEventListener("mousemove", suit.register_mousemove, false);

	addEventListener("touchstart", function(event) {
		var changed, length;

		changed = event.changedTouches;
		length = changed.length;
		while (length--) {
			suit.register_button (changed[length], suit.Event.ButtonPress);
		}

		event.stopPropagation ();
		event.preventDefault ();
		return false;
	}, false);

	addEventListener("touchend", function(event) {
		var changed, length;

		changed = event.changedTouches;
		length = changed.length;
		while (length--) {
			suit.register_button (changed[length], suit.Event.ButtonRelease);
		}

		event.stopPropagation ();
		event.preventDefault ();
		return false;
	}, false);

	addEventListener("touchmove", function(event) {
		var changed, length;

		changed = event.changedTouches;
		length = changed.length;
		while (length--) {
			suit.register_mousemove (changed[length]);
		}

		event.stopPropagation ();
		event.preventDefault ();
		return false;
	}, false);

	//*/

	// Others
	addEventListener("DOMMouseScroll", suit.register_mousewheel, false);
	addEventListener("MozMousePixelScroll", suit.register_mousewheel, false);
	

	/*
	addEventListener("contextmenu", function(event) {
		var widget;

		widget = suit.get_relevant_widget (event, suit.Event.None, true);
		if (widget) {
			event.stopPropagation();
			event.preventDefault();
			return false;
		}

	}, false);
	//*/

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

suit.inherit = (function() {
	if (typeof Object.create === "function") {
		return function(func, base) {
			func.prototype = Object.create(base.prototype, {
				constructor: {
					value: func,
					enumerable: false,
					writable: true,
					configurable: true
				}
			});
		};
	}

	if (typeof Object.defineProperties === "function") {
		return function(func, base) {
			var dummy = function() {};
			dummy.prototype = base.prototype;
			
			func.prototype = new dummy;
			Object.defineProperties(func.prototype, {
				constructor: {
					value: func,
					enumerable: false,
					writable: true,
					configurable: true
				}
			});
		};
	}
	
	return function(func, base) {
		var dummy = function() {};
		dummy.prototype = base.prototype;
		
		func.prototype = new dummy;
		func.prototype.constructor = func;
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
