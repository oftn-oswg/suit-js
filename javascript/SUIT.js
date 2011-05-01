var SUIT = {
	construct_prototype: function(base) {
		var f = function() {};
		f.prototype = base.prototype;
		return new f();
	},
	HORIZONTAL: 1,
	VERTICAL: 2
};
