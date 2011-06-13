var demo_text = "\tThis is text from a Label widget that has been added as the child of a Packer widget. The Packer widget lines up widgets in a row or column with optional spacing. It's the child of the Scroller widget which allows you to use your mouse wheel to scroll text. Scroll bars will be added when it becomes more developed. As a fallback, you can use your mouse to click-and-drag inside the Scroller to pan around. \n\n\tYou can set preferences to the Label widget to make it suit your needs. Currently you can set the font face, font size, line-height, and alignment (horizontal and vertical).\n\n\tAnother widget currently developed is the Button, which is underneath this Label text. It is added alongside this Label in the Packer.\n\n\tLorem Ipsum is simply dummy text of the printing and typesetting industry. Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.\n\n\tThere are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.";

new suit.Screen ()
	.set_child (
		new suit.Scroller (
			new suit.Packer ("vertical")
				.set_spacing (18)
				.add (
					new suit.Image ("./images/suit-logo.png")
						.set_align ("left"))
				.add (
					new suit.Label (demo_text)
						.set_line_height (1.6))
				.add (
					new suit.Button ("Test button")
						.connect ("activate", function() {
							var a = [], i = 50;
							while (i--) a.push(97+Math.random()*26|0);
							this.get_child ().set_text (String.fromCharCode.apply (null, a));
						}))
				.add (
					new suit.Packer ("horizontal")
						.set_spacing (18)
						.add (
							new suit.Button ("Alert()")
								.connect ("activate", function() {
									alert ("You clicked me!");
								}))
						.add (
							new suit.Button ("Prompt()")
								.connect ("activate", function() {
									var text = prompt ("Enter some text and the button's label will be updated with the text:");
									if (text) {
										this.get_child ().set_text (text);
									}
								}))
						.add (new suit.Button ("Button 3"))
						.add (
							new suit.Packer ("vertical")
								.set_spacing (18)
								.add (new suit.Button ("Button 4"))
								.add (new suit.ProgressBar ("horizontal"))))
				.add (
					new suit.Label ("This is just some more text placed after the Button above. This text is aligned to the right, one of the many things you can do with a Label. How cool is that? Underneath is the source code used for this demo.")
						.set_line_height (1.6)
						.set_align ("right"))
				.add (
					new suit.Button ("Open the source code of this demo in a new window")
						.connect ("activate", function() {
							window.open("demo.js");
						})
					)));

//viewsourcebtn.get_child().layout.set_font(["Droid Sans Mono", "Courier New", "monospace"], 14);
