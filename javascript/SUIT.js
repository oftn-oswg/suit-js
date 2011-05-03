var SUIT = {
	construct_prototype: function(base) {
		var f = function() {};
		f.prototype = base.prototype;
		return new f();
	},
	HORIZONTAL: 1,
	VERTICAL: 2,
	get_mouse_coordinates: function(canvas, e) {
		var x = 0;
		var y = 0;
		if (e.pageX || e.pageY) { 
			x = e.pageX;
			y = e.pageY;
		} else { 
			x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
			y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
		}
		x -= canvas.offsetLeft;
		y -= canvas.offsetTop;
		return [x, y];
	}
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
