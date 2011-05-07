suit.Event = {
	None: 0,
	
	ButtonPress: 1,
	ButtonRelease: 2,
	ButtonDblPress: 4,

	KeyPress: 8,
	KeyRelease: 16,
	
	ScrollUp: 32,
	ScrollDown: 64,
	ScrollLeft: 128,
	ScrollRight: 256,
	
	Motion: 512
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
	this.type = type; // KeyPress | KeyRelease
	//this.time = new Date(); // Time the event was generated
	this.state = state; // (Modifiers -- shift, ctrl, capslock, alt)
	this.keycode = keycode; // The key code
};
suit.EventKey.prototype.name = "event_key";

// Mouse button events
suit.EventButton = function(type, state, button, x, y, id) {
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
suit.EventScroll = function(type, state, x, y, id) {
	this.type = type; // ScrollUp | ScrollDown | ScrollLeft | ScrollRight
	//this.time = new Date(); // Time the event was generated
	this.state = state; // (Modifiers -- shift, ctrl, capslock, alt)
	this.x = x; // x-coordinate of mouse when event occured
	this.y = y; // y-coordinate of mouse when event occured
	this.id = id; // Used for multitouch
};
suit.EventScroll.prototype.name = "event_scroll";

// Move move events
suit.EventMotion = function(state, x, y, id) {
	this.type = suit.Event.Motion;
	//this.time = new Date(); // Time the event was generated
	this.state = state; // (Modifiers -- shift, ctrl, capslock, alt)
	this.x = x; // x-coordinate of mouse when event occured
	this.y = y; // y-coordinate of mouse when event occured
	this.id = id; // Used for multitouch
};
suit.EventMotion.prototype.name = "event_motion";
