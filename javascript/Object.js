var BaseObject = function() {
	this.signals = {};
};

BaseObject.prototype.connect = function( signal, fn ) {

	if( typeof this.signals[signal] == 'undefined' ) {
		this.signals[signal] = [];
	}
	this.signals[signal].push({
		'callback': fn,
		'extras': Array.prototype.slice.call(arguments, 2)
	});
	return true;
};

BaseObject.prototype.disconnect = function( signal, fn ) {

	if( typeof this.signals[signal] == 'undefined' )
		return false;

	for( var i = 0, len = this.signals[signal].length; i < len; i++ ) {
		if( this.signals[signal][i]['callback'] === fn ) {
			this.signals[signal].splice(i, 1);
			return true;
		}
	}

	return true;

};

BaseObject.prototype.emit = function( signal ) {

	if( typeof this.signals[signal] == 'undefined' )
		return false;

	for( var i = 0, len = this.signals[signal].length; i < len; i++ ) {
		this.signals[signal][i]['callback'].apply(this, this.signals[signal][i]['extras']);
	}

};
