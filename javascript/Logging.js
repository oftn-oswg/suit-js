suit.Error = function(msg) {
	this.message = msg;
};
suit.Error.prototype.name = "SUITError";

suit.log = function() {
	console.log.apply(console, arguments);
};

suit.info = function() {
	console.info.apply(console, arguments);
};

suit.warn = function() {
	console.warn.apply(console, arguments);
};

suit.error = function() {
	console.error.apply(console, arguments);
	throw new suit.Error(Array.prototype.join.call(arguments, " "));
};
