var suit = {};

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
