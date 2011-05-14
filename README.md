# The SUIT Canvas Toolkit

What does SUIT mean? It stands for "slick user-interface toolkit". It is meant to be an easy-to-use, beautiful, and fully-featured UI toolkit for the HTML5 canvas. Why use HTML canvas and not normal DOM methods? There are some specialized web applications that require more than just what can be achieved with normal DOM methods. With canvas, you get more flexibility in the design, look-and-feel, and controls. Rendering and page layout also works while hardly having to worry about how things will look and behave in another browser. Besides being useful to you, this was started as an experiment to see how UI toolkits can work in the browser environment.

The project is nowhere near being fully-featured, but work is continuing at a very rapid pace. A lot of the code is ported from or inspired by the [SUIT Midlet Toolkit](https://code.google.com/p/suit-midlet-toolkit/) and the [GTK+ Toolkit](http://www.gtk.org/).

SUIT will eventually provide many widgets of which to create your applications.

## Demo

`index.html` is a demo file which you can use to play around with SUIT.

## Building

This project uses [Node.js](http://nodejs.org/) to calculate the dependencies in `javascript/` and combine them in `build/suit-uncompressed.js`. If you have [UglifyJS](https://github.com/mishoo/UglifyJS) for Node.js installed, code will be compressed and saved to `build/suit-min.js`. To use, navigate to `build/` and run:

```
node make.js
```

This will take care of everything.

© The ΩF:∅ Foundation
