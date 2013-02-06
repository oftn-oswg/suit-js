(function() {
	"use strict";

	var demo_text = "\tThis is text from a Label widget that has been added as the child of a Packer widget. The Packer widget lines up widgets in a row or column with optional spacing. It's the child of the Scroller widget which allows you to scroll its contents.";

	var screen, scroller, vpack, hpack, logo, demo_label, button, button_alert, button_prompt, more_text, source;

	suit.init();

	screen = new suit.Screen (document.body);

	vpack = new suit.Packer ("vertical");
	vpack.set_spacing (18);

	logo = new suit.Image ("./images/suit-logo.png");
	logo.set_align ("left");
	vpack.add (logo);

	demo_label = new suit.Label(demo_text);
	demo_label.set_line_height(1.6);
	vpack.add (demo_label);

	button = new suit.Button("Click me! I'm a button.");

	var clicks = 0;
	button.connect ("activate", function() {
		var text;

		clicks++;
		switch (clicks) {
			case 42: text = "You don't want to wear me out do you?"; break;
			case 63: text = "I'm fine being clicked all day, but I'm worried about your health."; break;
			case 109: text = "Please call 9-1-1 if you are having a seizure."; break;
			default: text = "I have been clicked " + clicks + " time" + (clicks === 1 ? "" : "s") + "!";
		}
		this.get_child ().set_text (text);
	});
	vpack.add (button);

	hpack = new suit.Packer ("horizontal");
	hpack.set_spacing (18);

	button_alert = new suit.Button ("Alert");
	button_alert.connect ("activate", function() {
		alert ("You clicked me!");
	});
	hpack.add (button_alert);

	button_prompt = new suit.Button ("Prompt");
	button_prompt.connect ("activate", function() {
		var text = prompt ("Enter some text and the button's label will be updated with the text:", this.get_child ().text);
		if (text != null) {
			this.get_child ().set_text (text);
		}
	});
	hpack.add (button_prompt);
	vpack.add (hpack);

	more_text = new suit.Label ("You can set preferences to the Label widget to make it suit your needs. Currently you can set the font face, font size, line-height, and alignment (horizontal and vertical).");
	more_text.set_line_height (1.6);
	more_text.set_align ("right");
	vpack.add (more_text);

	source = new suit.Button ("Open the source code used in this demo in a new window");
	source.connect ("activate", function() {
		open ("demo.js");
	});
	vpack.add (source);

	scroller = new suit.Scroller (vpack);
	screen.set_child (scroller);

	resize();
	screen.show_all ();

	function resize() {
		var x, y, w, h, ww, wh;

		ww = window.innerWidth;
		wh = window.innerHeight;

		w = Math.min(600, ww-50);
		h = Math.min(400, wh-50);

		x = (ww - w) / 2;
		y = (wh - h) / 2;

		screen.size_allocate (new suit.Allocation (x, y, w, h));
	};

	addEventListener ("resize", resize, false);

})();
