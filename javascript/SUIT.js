var suit = (function() {
	"use strict";

	var unique = 1; // A unique number to represent a widget.
	var widgets = []; // Mapping of unique numbers to widgets.
	var initialized = false; // Have we called suit.init() yet?

	var suit = {}; // The suit global namespace

	// When set to a suit.Window object, events are channeled directly to it.
	suit.lock = null;

	suit.unique = function() { return unique++; };
	suit.register_widget = function (unique, widget) {
		if (widgets[unique]) {
			throw new Error("ID " + unique + " has already been registered.");
		}
		widgets[unique] = widget;
	};
	suit.unregister_widget = function(unique) {
		delete widgets[unique];
	};

	function register (widget, event, event_dom) {
		if (widget.event && widget.event (event)) {
			event_dom.stopPropagation && event_dom.stopPropagation();
			event_dom.preventDefault && event_dom.preventDefault();
			return false;
		}

		return true;
	};

	function get_relevant_widget (event, mask, no_lock) {
		var target, widget;

		if (!no_lock && suit.lock) return suit.lock;

		target = event.target || event.srcElement;
		if (target.nodeType === 3) target = target.parentNode;

		do {
			if (!target.suit_unique) return null;

			widget = widgets[target.suit_unique];
			if (widget.event_mask & mask || mask === suit.Event.None) break;

			if (target.suit_empty) {
				target = target.parentNode.firstChild;
			} else {
				target = target.parentNode.parentNode.firstChild;
			}

		} while (target);

		return widget;
	};


	function get_event_position (event, target) {
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


	function get_event_button (event) {
		var right_click;
		
		right_click = false;
		if (event.which) right_click = (event.which == 3);
		else if (event.button) right_click = (event.button == 2);
		return right_click ? 3 : 1;
	};

	function register_button (event, type) {
		var widget, target, pos, button;

		widget = get_relevant_widget (event, type);
		if (!widget) return true;

		target = widget.window.base;
		pos = get_event_position (event, target);
		button = get_event_button (event);
		
		return register (
			widget,
			new suit.EventButton (
				type,
				suit.Modifiers.None,
				button, pos.x, pos.y, -1),
			event);
	};


	function register_mousemove (event) {
		var widget, target, pos;
		
		widget = get_relevant_widget (event, suit.Event.Motion);
		if (!widget) return true;

		target = widget.window.base;
		pos = get_event_position (event, target);

		return register (
			widget,
			new suit.EventMotion (
				suit.Modifiers.None,
				pos.x, pos.y, -1),
			event);
	};


	function register_mousewheel (event) {
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

		widget = get_relevant_widget (event, suit.Event.Scroll);
		if (!widget) return true;
		
		target = widget.window.base;
		pos = get_event_position (event, target);

		return register (
			widget,
			new suit.EventScroll (
				suit.Modifiers.None,
				pos.x, pos.y, deltaX, deltaY, -1),
			event);
	};

	suit.init = function() {

		var style, sheet, nsuri;

		if (!initialized) {
			initialized = true;
		} else {
			return;
		}

		nsuri = "http://www.w3.org/1999/xhtml";
		style = document.createElementNS (nsuri, "style");
		style.type = "text/css";
		document.documentElement.appendChild (style);

		sheet = style.sheet;
		sheet.insertRule (".suit { position: absolute; overflow: hidden; font: 16px \"Droid Sans\", \"Segoe UI\", \"Lucide Grande\", \"DejaVu Sans\", \"Bitstream Vera Sans\", \"sans-serif\"; user-select: element; -webkit-user-select: element; -moz-user-select: element; -khtml-user-select: element; }", 0);

		addEventListener("mousedown", function(event) {
			return register_button (event, suit.Event.ButtonPress);
		}, false);

		addEventListener("mouseup", function(event) {
			return register_button (event, suit.Event.ButtonRelease);
		}, false);

		addEventListener("mousewheel", register_mousewheel, false);
		addEventListener("mousemove", register_mousemove, false);

		addEventListener("touchstart", function(event) {
			var changed, length;

			changed = event.changedTouches;
			length = changed.length;
			while (length--) {
				register_button (changed[length], suit.Event.ButtonPress);
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
				register_button (changed[length], suit.Event.ButtonRelease);
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
				register_mousemove (changed[length]);
			}

			event.stopPropagation ();
			event.preventDefault ();
			return false;
		}, false);

		//*/

		// Others
		addEventListener("DOMMouseScroll", register_mousewheel, false);
		addEventListener("MozMousePixelScroll", register_mousewheel, false);
		

		/*
		addEventListener("contextmenu", function(event) {
			var widget;

			widget = get_relevant_widget (event, suit.Event.None, true);
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

	return suit;
}());


// Define some ES5 Functions for those ES3 environments.

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