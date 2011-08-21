suit.Animation = function() {};

suit.Animation.prototype.started = false;
suit.Animation.prototype.prev = null;
suit.Animation.prototype.next = null;

suit.Animation.prototype.start = function(length, from, to, callback) {
	this.now = Date.now();
	this.from = from;
	this.to = to;
	this.length = length;
	this.callback = callback;

	callback.call (this, from);

	if (this.started) this.remove ();
	this.add ();
};

suit.Animation.prototype.add = function() {
	var first = suit.Animation.first;

	if (first) {
		first.next = this;
		this.prev = first;
	} else {
		suit.Animation.first = this;
	}

	suit.Animation.running++;

	this.started = true;
	suit.Animation.start ();
};

suit.Animation.prototype.remove = function() {
	if (this.prev) {
		this.prev.next = this.next;
	}
	if (this.next) {
		this.next.prev = this.prev;
	}

	suit.Animation.running--;
	if (!suit.Animation.running) {
		suit.Animation.first = null;
	}

	this.started = false;
};

suit.Animation.prototype.get = function(percent) {
	var from, to;

	from = this.from;
	to = this.to;

	return from + (percent * (to-from));
};

suit.Animation.prototype.step = function(now) {
	var percent, length, diff;
	
	length = this.length;
	diff = now - this.now;

	if (diff >= length) {
		// call callback with 'to'
		// return true
		this.callback.call (this, this.to);
		this.remove ();
		return;
	}

	percent = diff / length;
	this.callback.call (this, this.get (percent));
};

suit.Animation.first = null;
suit.Animation.running = 0;
suit.Animation.timer = false;

suit.Animation.request_frame =
	window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	function(callback, element) {
		setTimeout(callback, 13);
	};

suit.Animation.step = function() {
	var first, now;

	first = this.first;
	now = Date.now();

	while (first) {
		first.step (now);
		first = first.next;
	}

	this.start ();
};

suit.Animation.start = function() {
	var self;
	
	self = this;

	if (this.running && !this.timer) {
		this.timer = true;
		this.request_frame.call (window, function() {
			self.timer = false;
			self.step ();
		});
	}

};
