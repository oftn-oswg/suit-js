# The SUIT Canvas Toolkit

What does it mean? SUIT stands for "slick user-interface toolkit". It is meant to be a easy-to-use, beautiful, modular, and fully-featured UI toolkit for the HTML5 canvas.

The project is nowhere near being fully-featured, but work is continuing at a very rapid pace. A lot of the code is ported from or inspired by the [SUIT Midlet Toolkit](https://code.google.com/p/suit-midlet-toolkit/) and the [GTK+ Toolkit](http://www.gtk.org/).

    -- The ΩF:∅ Foundation
    
## Object Hierarchy

<pre>
[+] BaseObject (Object.js)
  |    Objects that emit events which can be connected to callbacks
  |
  +-[+] Widget (Widget.js)
     |    Objects that render on the screen in a predefined
     |    rectangular space and respond to events
     |
     +-[+] Container (Container.js)
     |       Widgets which hold child widgets, usually created for
     |       position the child widgets for layout
     |   
     +-[+] Bin (Bin.js)
     |  |    Widgets which hold only one child widget
     |  |
     |  +-[+] Button (Button.js)
     |  |       Widget that you click, pretty obvious. Usually holds
     |  |       a Label widget, but it doesn't have to.
     |  |
     |  +-[+] Screen (Screen.js)
     |          The main canvas element which holds your entire application
     |
     +-[+] Label (Label.js)
             Widget which displays text in a rectangular area
</pre>
