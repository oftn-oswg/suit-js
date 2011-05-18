suit.Error = function(msg) {
	this.message = msg;
};
suit.Error.prototype.name = "SUITError";

suit.log = function() {
	if (console.log.apply) {
		console.log.apply(console, arguments);
	} else {
		console.log(arguments[0]);
	}
};

suit.info = function() {
	if (console.info.apply) {
		console.info.apply(console, arguments);
	} else {
		console.info(arguments[0]);
	}
};

suit.warn = function() {
	if (console.warn.apply) {
		console.warn.apply(console, arguments);
	} else {
		console.warn(arguments[0]);
	}
};

suit.error = function() {
	if (console.error.apply) {
		console.error.apply(console, arguments);
	} else {
		console.error(arguments[0]);
	}
	throw new suit.Error(Array.prototype.join.call(arguments, " "));
};
