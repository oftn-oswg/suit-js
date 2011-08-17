var demo_text = "\tThis is text from a Label widget that has been added as the child of a Packer widget. The Packer widget lines up widgets in a row or column with optional spacing. It's the child of the Scroller widget which allows you to use your mouse wheel to scroll text. Scroll bars will be added when it becomes more developed.\n\n\tYou can set preferences to the Label widget to make it suit your needs. Currently you can set the font face, font size, line-height, and alignment (horizontal and vertical).\n\n\tAnother widget currently developed is the Button, which is underneath this Label text. It is added alongside this Label in the Packer.\n\n\tLorem Ipsum is simply dummy text of the printing and typesetting industry. Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.\n\n\tThere are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.";

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

button = new suit.Button("Test button");
button.connect ("activate", function() {
	var a = [], i = 50;
	while (i--) a.push (97+Math.random()*26|0);
	this.get_child ().set_text (String.fromCharCode.apply (null, a));
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

more_text = new suit.Label ("This is just some more text placed after the buttons above. This text is aligned to the right, of the the many things you can do with a Label. How cool is that?");
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

screen.set_allocation (new suit.Allocation(50, 50, 640, 420));
screen.show_all ();
