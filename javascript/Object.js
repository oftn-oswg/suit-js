suit.Object = function() {
	this.signals = {};
};

suit.Object.prototype.connect = function( signal, fn ) {
	suit.ensure(signal, "string");
	suit.ensure(fn, "function");

	if( typeof this.signals[signal] == 'undefined' ) {
		this.signals[signal] = [];
	}
	this.signals[signal].push({
		'callback': fn,
		'extras': Array.prototype.slice.call(arguments, 2)
	});
	return this;
};

suit.Object.prototype.disconnect = function( signal, fn ) {
	suit.ensure(signal, "string");
	suit.ensure(fn, "function");

	if( typeof this.signals[signal] == 'undefined' )
		return this;

	for( var i = 0, len = this.signals[signal].length; i < len; i++ ) {
		if( this.signals[signal][i]['callback'] === fn ) {
			this.signals[signal].splice(i, 1);
			return this;
		}
	}

	return this;

};

suit.Object.prototype.emit = function( signal ) {
	suit.ensure(signal, "string");

	if( typeof this.signals[signal] == 'undefined' )
		return false;

	var args = Array.prototype.slice.call(arguments, 1);

	for( var i = 0, len = this.signals[signal].length; i < len; i++ ) {
		this.signals[signal][i]['callback'].apply(this,
			args.concat(this.signals[signal][i]['extras']));
	}
	return this;

};
