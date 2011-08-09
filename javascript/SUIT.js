var suit = {};

// When set to a suit.Window object, events are channeled directly to it.
suit.lock = null;

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

Function.prototype.inherit = function() {
	var f = function() {};
	f.prototype = this.prototype;
	return new f();
};

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
