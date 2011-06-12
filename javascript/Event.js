suit.Event = {
	None: 0,
	
	ButtonPress: 1,
	ButtonRelease: 2,
	ButtonDblPress: 4,

	KeyPress: 8,
	KeyRelease: 16,
	
	Scroll: 32,
	
	Motion: 64
};

suit.Modifiers = {
	None: 0,
	Shift: 1,
	CapsLock: 2,
	Ctrl: 4,
	Alt: 8,
	Super: 16
};

// Keyboard button events
suit.EventKey = function(type, state, keycode) {
	suit.ensure(type, "number");
	suit.ensure(state, "number");
	suit.ensure(keycode, "number");

	this.type = type; // KeyPress | KeyRelease
	//this.time = new Date(); // Time the event was generated
	this.state = state; // (Modifiers -- shift, ctrl, capslock, alt)
	this.keycode = keycode; // The key code
};
suit.EventKey.prototype.name = "event_key";

// Mouse button events
suit.EventButton = function(type, state, button, x, y, id) {
	suit.ensure(type, "number");
	suit.ensure(state, "number");
	suit.ensure(button, "number");
	suit.ensure(x, "number");
	suit.ensure(y, "number");
	suit.ensure(id, "number");
	
	this.type = type; // ButtonPress | ButtonRelease | ButtonDblPress
	//this.time = new Date(); // Time the event was generated
	this.state = state; // (Modifiers -- shift, ctrl, capslock, alt)
	this.button = button; // Left click: 1, Middle click: 2, Right click: 3
	this.x = x; // x-coordinate of mouse when event occured
	this.y = y; // y-coordinate of mouse when event occured
	this.id = id; // Used for multitouch
};
suit.EventButton.prototype.name = "event_button";

// Mouse wheel scroll events
suit.EventScroll = function(state, x, y, deltax, deltay, id) {
	suit.ensure(state, "number");
	suit.ensure(x, "number");
	suit.ensure(y, "number");
	suit.ensure(deltax, "number");
	suit.ensure(deltay, "number");
	suit.ensure(id, "number");
	
	this.type = suit.Event.Scroll;
	//this.time = new Date(); // Time the event was generated
	this.state = state; // (Modifiers -- shift, ctrl, capslock, alt)
	this.x = x; // x-coordinate of mouse when event occured
	this.y = y; // y-coordinate of mouse when event occured
	this.deltaX = deltax; // amount of scroll horizontally
	this.deltaY = deltay; // amount of scroll vertically
	this.id = id; // Used for multitouch
};
suit.EventScroll.prototype.name = "event_scroll";

// Move move events
suit.EventMotion = function(state, x, y, id) {
	suit.ensure(state, "number");
	suit.ensure(x, "number");
	suit.ensure(y, "number");
	suit.ensure(id, "number");
	
	this.type = suit.Event.Motion;
	//this.time = new Date(); // Time the event was generated
	this.state = state; // (Modifiers -- shift, ctrl, capslock, alt)
	this.x = x; // x-coordinate of mouse when event occured
	this.y = y; // y-coordinate of mouse when event occured
	this.id = id; // Used for multitouch
};
suit.EventMotion.prototype.name = "event_motion";
