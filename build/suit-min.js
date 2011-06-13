var suit = {};

suit.ensure = function(a, b) {
    var c = typeof a;
    if (!Array.isArray(b)) if (typeof b == "string") {
        if (c !== b) throw new Error("Failed type check. Was expecting `" + b + "` but got `" + c + "`.");
    } else if (typeof b == "function") {
        var d = c;
        c === "object" && (d = "object of " + (a.constructor.name ? a.constructor.name : "[object Function]"));
        if (!(a instanceof b)) throw new Error("Failed type check. Was expecting instance of `" + (b.name ? b.name : "[object Function]") + "` but got `" + d + "`.");
    }
}, Function.prototype.inherit = function() {
    var a = function() {};
    a.prototype = this.prototype;
    return new a;
}, Function.prototype.bind || (Function.prototype.bind = function(a) {
    var b = [].slice, c = b.call(arguments, 1), d = this, e = function() {}, f = function() {
        return d.apply(this instanceof e ? this : a || {}, c.concat(b.call(arguments)));
    };
    e.prototype = d.prototype, f.prototype = new e;
    return f;
}), Array.isArray || (Array.isArray = function(a) {
    return Object.prototype.toString.call(a) === "[object Array]";
}), suit.Event = {
    None: 0,
    ButtonPress: 1,
    ButtonRelease: 2,
    ButtonDblPress: 4,
    KeyPress: 8,
    KeyRelease: 16,
    Scroll: 32,
    Motion: 64
}, suit.Modifiers = {
    None: 0,
    Shift: 1,
    CapsLock: 2,
    Ctrl: 4,
    Alt: 8,
    Super: 16
}, suit.EventKey = function(a, b, c) {
    suit.ensure(a, "number"), suit.ensure(b, "number"), suit.ensure(c, "number"), this.type = a, this.state = b, this.keycode = c;
}, suit.EventKey.prototype.name = "event_key", suit.EventButton = function(a, b, c, d, e, f) {
    suit.ensure(a, "number"), suit.ensure(b, "number"), suit.ensure(c, "number"), suit.ensure(d, "number"), suit.ensure(e, "number"), suit.ensure(f, "number"), this.type = a, this.state = b, this.button = c, this.x = d, this.y = e, this.id = f;
}, suit.EventButton.prototype.name = "event_button", suit.EventScroll = function(a, b, c, d, e, f) {
    suit.ensure(a, "number"), suit.ensure(b, "number"), suit.ensure(c, "number"), suit.ensure(d, "number"), suit.ensure(e, "number"), suit.ensure(f, "number"), this.type = suit.Event.Scroll, this.state = a, this.x = b, this.y = c, this.deltaX = d, this.deltaY = e, this.id = f;
}, suit.EventScroll.prototype.name = "event_scroll", suit.EventMotion = function(a, b, c, d) {
    suit.ensure(a, "number"), suit.ensure(b, "number"), suit.ensure(c, "number"), suit.ensure(d, "number"), this.type = suit.Event.Motion, this.state = a, this.x = b, this.y = c, this.id = d;
}, suit.EventMotion.prototype.name = "event_motion", suit.Allocation = function(a, b, c, d) {
    suit.ensure(a, "number"), suit.ensure(b, "number"), suit.ensure(c, "number"), suit.ensure(d, "number"), this.x = a | 0, this.y = b | 0, this.width = c > 1 ? c | 0 : 1, this.height = d > 1 ? d | 0 : 1;
}, suit.Allocation.prototype.args = function() {
    return [ this.x, this.y, this.width, this.height ];
}, suit.Object = function() {
    this.signals = {};
}, suit.Object.prototype.connect = function(a, b) {
    suit.ensure(a, "string"), suit.ensure(b, "function"), typeof this.signals[a] == "undefined" && (this.signals[a] = []), this.signals[a].push({
        callback: b,
        extras: Array.prototype.slice.call(arguments, 2)
    });
    return !0;
}, suit.Object.prototype.disconnect = function(a, b) {
    suit.ensure(a, "string"), suit.ensure(b, "function");
    if (typeof this.signals[a] == "undefined") return !1;
    for (var c = 0, d = this.signals[a].length; c < d; c++) if (this.signals[a][c].callback === b) {
        this.signals[a].splice(c, 1);
        return !0;
    }
    return !0;
}, suit.Object.prototype.emit = function(a) {
    suit.ensure(a, "string");
    if (typeof this.signals[a] == "undefined") return !1;
    var b = Array.prototype.slice.call(arguments, 1);
    for (var c = 0, d = this.signals[a].length; c < d; c++) this.signals[a][c].callback.apply(this, b.concat(this.signals[a][c].extras));
}, suit.TextLayout = function() {
    suit.Object.call(this), this.text = "", this.text_split = [ "" ], this.text_wrapped = [ "" ], this.font_name = "sans-serif", this.font_size = 14, this.line_height = null, this.align = "left", this.width = null, this.calculated = !0, this.wrapped_length_cache = [], this.em_width = this.text_width("M");
}, suit.TextLayout.canvas_context = function() {
    var a = document.createElement("canvas");
    return a.getContext("2d");
}(), suit.TextLayout.prototype = suit.Object.inherit(), suit.TextLayout.prototype.text_width = function(a) {
    suit.ensure(a, "string"), suit.TextLayout.canvas_context.font = this.get_css_font_string();
    return suit.TextLayout.canvas_context.measureText(a).width;
}, suit.TextLayout.prototype.invalidate = function() {
    this.calculated = !1, this.wrapped_length_cache = [];
}, suit.TextLayout.prototype.set_text = function(a) {
    suit.ensure(a, "string"), this.text !== a && (this.text = a, this.text_split = a.split("\n"), this.invalidate(), this.emit("resize"));
}, suit.TextLayout.prototype.set_font = function(a, b) {
    suit.ensure(a, [ "string", "undefined" ]), suit.ensure(b, [ "number", "undefined" ]), a && (this.font_name = Array.isArray(a) ? '"' + a.join('", "') + '"' : '"' + a + '"'), b && (this.font_size = b), this.invalidate(), this.em_width = this.text_width("M"), this.emit("resize");
}, suit.TextLayout.prototype.set_line_height = function(a) {
    suit.ensure(a, "number"), this.line_height = a, this.emit("resize");
}, suit.TextLayout.prototype.set_align = function(a) {
    suit.ensure(a, "string"), this.align = a;
}, suit.TextLayout.prototype.set_width = function(a) {
    suit.ensure(a, "number"), this.width !== a && (this.width = a, this.calculated = !1);
}, suit.TextLayout.prototype.get_css_font_string = function() {
    return this.font_size + "px " + this.font_name;
}, suit.TextLayout.prototype.get_index_at_pos = function(a, b) {
    suit.ensure(a, "number"), suit.ensure(b, "number");
    var c = this.get_line_size(), d = this.text_wrapped.length, e = b / c | 0;
    e = e > d ? d : e < 0 ? 0 : e;
    var f = this.text_wrapped[e], g = 0;
    if (a <= 0 || f.length === 0) g = 0; else if (a >= this.text_width(f)) g = f.length; else for (var h = 0, i = f.length; h <= i; h++) {
        var j = h == 0 ? 0 : this.text_width(f.substring(0, h));
        j += this.text_width(f.charAt(h)) / 2 | 0;
        if (j >= a) {
            g = h;
            break;
        }
    }
    return [ e, g, f.charAt(g) ];
}, suit.TextLayout.prototype.recalculate_layout = function() {
    var a;
    this.width ? (a = [], this.perform_text_wrap(this.text_split, this.width, function(b) {
        a.push(b);
    })) : a = this.line_split, this.calculated = !0, this.text_wrapped = a;
}, suit.TextLayout.prototype.perform_text_wrap = function(a, b, c) {
    suit.ensure(a, "object"), suit.ensure(b, "number"), suit.ensure(c, "function"), suit.log("Performing text wrap.", this.text.substr(0, 20).replace(/^\s+/, ""), b);
    for (var d = 0, e = a.length; d < e; d++) {
        var f, g = a[d], h = 0, i = 0, j = 0;
        while (f = g.substr(j).match(/. |-[^ ]|.$/)) {
            i += f.index + 1;
            var k = g.substring(h, i);
            h !== 0 && (k = k.replace(/^\s+/, "")), this.text_width(k) > b && (c.call(this, g.substring(h, j)), h = j), j = i;
        }
        c.call(this, g.substring(h));
    }
}, suit.TextLayout.prototype.get_preferred_height = function() {
    return this.text_split.length * this.get_line_size() + 1;
}, suit.TextLayout.prototype.get_preferred_width = function() {
    var a = 0;
    for (var b = 0, c = this.text_split.length; b < c; b++) a = Math.max(a, this.text_width(this.text_split[b]));
    return a + 1 | 0;
}, suit.TextLayout.prototype.get_preferred_height_for_width = function(a) {
    suit.ensure(a, "number");
    var b = 0, c = 0;
    typeof this.wrapped_length_cache[a] == "undefined" ? (this.perform_text_wrap(this.text_split, a, function(a) {
        b++;
    }), this.wrapped_length_cache[a] = b) : b = this.wrapped_length_cache[a], c = b * this.get_line_size() + 1 | 0;
    return c;
}, suit.TextLayout.prototype.get_preferred_width_for_height = function(a) {
    suit.ensure(a, "number");
    return this.get_preferred_width();
}, suit.TextLayout.prototype.get_line_size = function() {
    return this.line_height !== null ? this.font_size * this.line_height : this.font_size;
}, suit.TextLayout.prototype.render = function(a, b, c) {
    suit.ensure(a, suit.Graphics), suit.ensure(b, "number"), suit.ensure(c, "number"), this.calculated || this.recalculate_layout(), a.cc.save(), a.cc.font = this.get_css_font_string(), a.cc.textBaseline = "top", a.cc.textAlign = this.align;
    var d = this.get_line_size(), e = 0, f, g;
    f = g = this.text_wrapped.length;
    var h = a.get_clip();
    h.y > c && (e = (h.y - c) / d | 0, e = e < 0 ? 0 : e), h.height && (f = e + (h.height / d | 0) + 2, f = f > g ? g : f);
    var i;
    for (; e < f; e++) i = this.text_wrapped[e].replace(/^\s+/, ""), a.cc.fillText(i, b, c + e * d + (d / 2 - this.font_size / 2) | 0);
    a.cc.restore();
}, suit.Graphics = function(a) {
    this.cc = a, this.clip = [];
}, suit.Graphics.prototype.rect = function(a, b, c, d, e, f) {
    if (typeof e == "undefined" || e === null) e = !1;
    if (typeof f == "undefined" || f === null) f = !0;
    f && this.cc.fillRect(a, b, c, d), e && this.cc.strokeRect(a, b, c, d);
}, suit.Graphics.prototype.push_clip = function(a, b, c, d) {
    this.cc.save(), this.cc.beginPath(), this.cc.rect(a, b, c, d), this.cc.clip(), this.clip.push({
        x: a,
        y: b,
        width: c,
        height: d
    });
}, suit.Graphics.prototype.pop_clip = function() {
    this.cc.restore(), this.clip.pop();
}, suit.Graphics.prototype.get_clip = function() {
    return this.clip.length ? this.clip[this.clip.length - 1] : null;
}, suit.Graphics.prototype.path = function(a, b, c, d) {
    if (typeof b == "undefined" || b === null) b = !1;
    if (typeof c == "undefined" || c === null) c = !0;
    if (typeof d == "undefined" || d === null) d = !1;
    this.cc.beginPath();
    for (var e = 0, f = a.length; e < f; e++) e ? this.cc.lineTo(a[e][0] + .5, a[e][1] + .5) : this.cc.moveTo(a[e][0] + .5, a[e][1] + .5);
    b && this.cc.closePath(), c && this.cc.stroke(), d && this.cc.fill();
}, suit.Graphics.prototype.set_shadow = function(a, b, c, d) {
    arguments.length ? (typeof a != "undefined" && a !== null && (this.cc.shadowOffsetX = a), typeof b != "undefined" && b !== null && (this.cc.shadowOffsetY = b), typeof c != "undefined" && c !== null && (this.cc.shadowBlur = c), typeof d != "undefined" && d !== null && (this.cc.shadowColor = d)) : (this.cc.shadowOffsetX = 0, this.cc.shadowOffsetY = 0, this.cc.shadowBlur = 0, this.cc.shadowColor = "transparent");
}, suit.Graphics.prototype.create_linear_gradient = function(a, b, c, d, e) {
    var f = this.cc.createLinearGradient(a, b, c, d);
    for (var g = 0, h = e.length; g < h; g++) f.addColorStop(e[g][0], e[g][1]);
    return f;
}, suit.Graphics.prototype.set_stroke_style = function(a, b, c, d) {
    typeof a != "undefined" && a !== null && (this.cc.lineWidth = a), typeof b != "undefined" && b !== null && (this.cc.lineCap = b), typeof c != "undefined" && c !== null && (this.cc.lineJoin = c), typeof d != "undefined" && d !== null && (this.cc.miterLimit = d);
}, suit.Graphics.prototype.set_font_style = function(a, b, c) {
    typeof a != "undefined" && a !== null && (this.cc.font = a), typeof b != "undefined" && b !== null && (this.cc.textAlign = b), typeof c != "undefined" && c !== null && (this.cc.textBaseline = c);
}, suit.Graphics.prototype.set_fill_stroke = function(a, b) {
    a && (this.cc.fillStyle = a), b && (this.cc.strokeStyle = b);
}, suit.Graphics.prototype.save = function() {
    this.cc.save();
}, suit.Graphics.prototype.restore = function() {
    this.cc.restore();
}, suit.Error = function(a) {
    this.message = a;
}, suit.Error.prototype.name = "SUITError", suit.log = function() {
    console.log.apply ? console.log.apply(console, arguments) : console.log(arguments[0]);
}, suit.info = function() {
    console.info.apply ? console.info.apply(console, arguments) : console.info(arguments[0]);
}, suit.warn = function() {
    console.warn.apply ? console.warn.apply(console, arguments) : console.warn(arguments[0]);
}, suit.error = function() {
    console.error.apply ? console.error.apply(console, arguments) : console.error(arguments[0]);
    throw new suit.Error(Array.prototype.join.call(arguments, " "));
}, suit.Widget = function() {
    suit.Object.call(this), this.parent = null, this.screen = null, this.event_mask = suit.Event.None;
}, suit.Widget.prototype = suit.Object.inherit(), suit.Widget.prototype.name = "Widget", suit.Widget.prototype.set_allocation = function(a) {
    suit.ensure(a, suit.Allocation), this.allocation = a;
}, suit.Widget.prototype.size_allocate = function(a) {
    suit.ensure(a, suit.Allocation), this.set_allocation(a);
}, suit.Widget.prototype.get_allocation = function() {
    return this.allocation;
}, suit.Widget.prototype.draw = function(a) {}, suit.Widget.prototype.get_request_mode = function() {}, suit.Widget.prototype.get_preferred_width = function() {}, suit.Widget.prototype.get_preferred_height = function() {}, suit.Widget.prototype.get_preferred_width_for_height = function() {}, suit.Widget.prototype.get_preferred_height_for_width = function() {}, suit.Widget.prototype.queue_redraw = function() {
    this.parent && this.parent.queue_redraw();
}, suit.Widget.prototype.queue_resize = function() {
    this.parent && this.parent.queue_resize();
}, suit.Widget.prototype.get_screen = function() {
    if (this.screen) return this.screen;
    var a = this;
    while (a.parent) {
        if (a.parent instanceof suit.Screen) return a.parent;
        a = a.parent;
    }
    return null;
}, suit.Widget.prototype.event_mask_add = function(a) {
    suit.ensure(a, "number"), this.event_mask |= a;
}, suit.Widget.prototype.event_mask_sub = function(a) {
    suit.ensure(a, "number"), this.event_mask ^= a;
}, suit.Widget.prototype.lock = function() {
    var a = this.get_screen();
    if (a.lock && a.lock !== this) {
        suit.error("Events are already locked by #%s.", a.lock.name);
        return !1;
    }
    a.lock = this;
    return !0;
}, suit.Widget.prototype.unlock = function() {
    this.get_screen().lock = null;
}, suit.Widget.prototype.register_event = function(a) {
    var b = a.type & (suit.Event.ButtonPress | suit.Event.ButtonRelease | suit.Event.ButtonDblPress | suit.Event.Scroll | suit.Event.Motion), c = !0;
    b && (a.x -= this.allocation.x, a.y -= this.allocation.y);
    if (this.children) {
        var d, e;
        b && (d = this.get_child_with_coords(a.x, a.y), d && (c = d.register_event(a), a.x += d.allocation.x, a.y += d.allocation.y));
    }
    if (c) {
        if (this.event_mask & a.type) {
            this.emit(a.name, a);
            return !1;
        }
        return !0;
    }
    return !1;
}, suit.Widget.prototype.get_local_coordinates = function(a, b) {
    suit.ensure(a, "number"), suit.ensure(b, "number");
    if (!this.allocation) return !1;
    a -= this.allocation.x, b -= this.allocation.y;
    return [ a, b ];
}, suit.Widget.prototype.get_absolute_coordinates = function(a, b) {
    suit.ensure(a, "number"), suit.ensure(b, "number");
    if (!this.allocation) return !1;
    a += this.allocation.x, b += this.allocation.y;
    return [ a, b ];
}, suit.Scrollbar = function(a) {
    suit.Widget.call(this), this.orientation = a || "vertical", this.style = {
        track_size: 16
    }, this.scroll = 0, this.scroll_size = 0;
}, suit.Scrollbar.prototype = suit.Widget.inherit(), suit.Scrollbar.prototype.name = "Scrollbar", suit.Scrollbar.prototype.draw = function(a) {
    suit.ensure(a, suit.Graphics);
    var b = this.allocation;
    a.set_stroke_style(4, "round"), a.set_fill_stroke(null, "#333");
    if (this.orientation === "horizontal") {
        var c = b.height / 2 | 0, d = 6 + -this.scroll / this.scroll_size * b.width, e = b.width / this.scroll_size * (b.width - 12) - 12;
        a.path([ [ d, c ], [ d + e, c ] ]);
    } else {
        var d = b.width / 2 | 0, c = 6 + -this.scroll / this.scroll_size * b.height, f = b.height / this.scroll_size * (b.height - 12) - 12;
        a.path([ [ d, c ], [ d, c + f ] ]);
    }
}, suit.Scrollbar.prototype.get_request_mode = function() {
    return SizeRequestMode.HEIGHT_FOR_WIDTH;
}, suit.Scrollbar.prototype.get_preferred_width = function() {
    var a = {
        minimum: 6,
        natural: 6
    };
    return a;
}, suit.Scrollbar.prototype.get_preferred_height = function() {
    var a = {
        minimum: 6,
        natural: 6
    };
    return a;
}, suit.Scrollbar.prototype.get_preferred_width_for_height = function(a) {
    suit.ensure(a, "number");
    var b = {
        minimum: 6,
        natural: 6
    };
    return b;
}, suit.Scrollbar.prototype.get_preferred_height_for_width = function(a) {
    suit.ensure(a, "number");
    var b = {
        minimum: 6,
        natural: 6
    };
    return b;
}, suit.Image = function(a) {
    suit.ensure(a, "string"), suit.Widget.call(this), this.filename = a, this.loaded = !1, this.usedimage = suit.Image.broken_image;
    var b = new Image;
    b.src = a, this.align = "center", this.valign = "middle";
    var c = this;
    b.onload = function() {
        c.loaded = !0, c.usedimage = this, c.queue_resize();
    };
}, suit.Image.broken_image = function() {
    var a = new Image;
    a.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAN8SURBVEiJtZXNa1xVGMZ/99xzP2YyY4pJNUFbQ40iZOXGjcuuhoK4k+7digSjbkQX4toJ+Be4E0FELHTtH6AgHZWxM8wkaTshk69Ocud+nfO6aO7NTBqhaekL7+Jc3vM893ne95zjiAjPM/TkwnGcAPCfETMVkaRciQgiQrvdXo3jeGiMkWfJOI6H7XZ7tcB1RATHcSpRFG0qpeastZOKnuiXJ21WSmGt3a1Wq1dEZFxYFHieN5em6RTo0/THGIPv+3NAAJQEjoiwtrZGq9W6MOhkrKyssL6+DuDAaZMdEaHValGv1x+zpvCzsE8pheM459a1Wq1C+RSBAtBaEwTB1EZjDG8Hwnt1l6s2BWBD+fwyMvyROLiuO0UwHo+ZwpxU4Hkevu+XBFmWcTPMuTHcgjvbDB2FweENMXyy+DK35l/lx1zjeV5J4HneuQoeI7DWspwecf3fv0hGRxyFId8sLnM3Fa4eHfLZ1oDr+w+5s7RCT1dQSl2MII5j3r3XI9s7ZEdpLo+O+fzSLt/Nv8bfvs/XScK3ewPeoc1vtQW01hhjGI1GGGNKAnWWIAiCsg8Lu0MGBj598Qp3Dehunw+32iykYzZqs2wZeOXgEBFBa43v+/i+XwzDFIGanPkoitje3mZ8HBPhEoUVvphdpGMUXv8+H+/dZ0mDQZGMEyYPZ9GLArtUYK0liiK63S6dToeDgwNa1qUejXnTyYmrM3x56SU6BvTmA1YHm1SPx7SsS5ZlxHFMHMckSXKuAscYQ7/fZ3d3lziOyfOcn4IqcZJxc6PPsmREYchXs5e5lwvOgx3i9FFNnuclQZqm5zfZGEOSJOUhEhG6lSrf+xU+GOzw0eiIw9oMKrfMWGGcG36YqdGtVAnyHGMMIkKaplMK9KRFaZqiVCEKrLX8Wp/lT0dx4/iY5YcRAL9rza3aC2zU6vjWkiSnt/P/EaiC/eR2nWpYN6zQ9Pxi/HBd91Ge7JmszbLs/CYDNBoNsiwjTdMysywrp6QALtSdV9toNJjELN6Da4PBoFOtVtFaP/E7cDZEhDzPiaKIhYWF10WkW1hke73ecGlpaf6pkM9Er9cbAhZOLRo0m83b/X5/33VdtNZorcurw/d9giAgDEPCMCQIgvK753llveu69Pv9/WazeRsYwIlFAI7jrADvA29NEF80LPAP8LOItKYInlf8BwLjX+eOMfEfAAAAAElFTkSuQmCC";
    return a;
}(), suit.Image.prototype = suit.Widget.inherit(), suit.Image.prototype.name = "Image", suit.Image.prototype.draw = function(a) {
    suit.ensure(a, suit.Graphics);
    var b = 0, c = 0;
    switch (this.align) {
      case "center":
        b = this.allocation.width / 2 - this.usedimage.width / 2;
        break;
      case "right":
        b = this.allocation.width - this.usedimage.width;
    }
    switch (this.valign) {
      case "middle":
        c = this.allocation.height / 2 - this.usedimage.height / 2;
        break;
      case "bottom":
        c = this.allocation.height - this.usedimage.height;
    }
    a.cc.drawImage(this.usedimage, b | 0, c | 0), suit.log("Drew image");
}, suit.Image.prototype.set_align = function(a) {
    suit.ensure(a, "string"), this.align = a, this.queue_redraw();
}, suit.Image.prototype.set_valign = function(a) {
    suit.ensure(a, "string"), this.valign = a, this.queue_redraw();
}, suit.Image.prototype.get_request_mode = function() {
    return SizeRequestMode.HEIGHT_FOR_WIDTH;
}, suit.Image.prototype.get_preferred_width = function() {
    var a = this.usedimage.width;
    return {
        minimum: a,
        natural: a
    };
}, suit.Image.prototype.get_preferred_height = function() {
    var a = this.usedimage.height;
    return {
        minimum: a,
        natural: a
    };
}, suit.Image.prototype.get_preferred_height_for_width = function(a) {
    var b = this.usedimage.height, c = this.usedimage.width, d = a / c * b;
    d = this.usedimage.height;
    return {
        minimum: d,
        natural: d
    };
}, suit.Image.prototype.get_preferred_width_for_height = function(a) {
    var b = this.usedimage.height, c = this.usedimage.width, d = a / b * c;
    d = this.usedimage.width;
    return {
        minimum: d,
        natural: d
    };
}, suit.Label = function(a) {
    suit.Widget.call(this), this.valign = "top", this.layout = new suit.TextLayout, this.layout.set_font([ "Droid Sans", "Segoe UI", "sans-serif" ], 16);
    var b = this;
    this.layout.connect("resize", function() {
        b.queue_resize();
    }), a && (suit.ensure(a, "string"), this.layout.set_text(a));
}, suit.Label.prototype = suit.Widget.inherit(), suit.Label.prototype.name = "Label", suit.Label.prototype.set_text = function(a) {
    suit.ensure(a, "string"), this.layout.set_text(a), this.queue_redraw();
}, suit.Label.prototype.set_align = function(a) {
    suit.ensure(a, "string"), this.layout.set_align(a), this.queue_redraw();
}, suit.Label.prototype.set_valign = function(a) {
    suit.ensure(a, "string"), this.valign = a, this.queue_redraw();
}, suit.Label.prototype.set_line_height = function(a) {
    this.layout.set_line_height(a), this.queue_redraw();
}, suit.Label.prototype.draw = function(a) {
    suit.ensure(a, suit.Graphics);
    var b, c, d;
    a.set_fill_stroke("#fff");
    switch (this.valign) {
      case "top":
        d = this.allocation.y;
        break;
      case "middle":
        b = this.layout.get_preferred_height(), d = this.allocation.y + this.allocation.height / 2 - b / 2 - 1 | 0;
        break;
      case "bottom":
        b = this.layout.get_preferred_height(), d = this.allocation.y + this.allocation.height - b - 1;
    }
    switch (this.layout.align) {
      case "left":
        c = this.allocation.x;
        break;
      case "center":
        c = this.allocation.x + this.allocation.width / 2 - 1 | 0;
        break;
      case "right":
        c = this.allocation.x + this.allocation.width - 1;
    }
    this.layout.render(a, c, d);
}, suit.Label.prototype.size_allocate = function(a) {
    suit.ensure(a, suit.Allocation), suit.Widget.prototype.size_allocate.call(this, a), this.layout.set_width(a.width);
}, suit.Label.prototype.get_request_mode = function() {
    return SizeRequestMode.HEIGHT_FOR_WIDTH;
}, suit.Label.prototype.get_preferred_width = function() {
    var a = this.layout.get_preferred_width();
    return {
        minimum: a,
        natural: a
    };
}, suit.Label.prototype.get_preferred_height = function() {
    var a = this.layout.get_preferred_height();
    return {
        minimum: a,
        natural: a
    };
}, suit.Label.prototype.get_preferred_height_for_width = function(a) {
    var b = this.layout.get_preferred_height_for_width(a);
    return {
        minimum: b,
        natural: b
    };
}, suit.Label.prototype.get_preferred_width_for_height = function(a) {
    var b = this.layout.get_preferred_width_for_height(a);
    return {
        minimum: b,
        natural: b
    };
}, suit.Container = function() {
    suit.Widget.call(this), this.children = [], this.connect("add", function() {
        this.allocation && this.size_allocate(this.allocation);
    });
}, suit.Container.prototype = suit.Widget.inherit(), suit.Container.prototype.name = "Container", suit.Container.prototype.index_of = function(a) {
    suit.ensure(a, suit.Widget);
    if ((index = this.children.indexOf(a)) > -1) return index;
    return !1;
}, suit.Container.prototype.add = function(a) {
    suit.ensure(a, suit.Widget), this.children.push(a), a.parent = this, a.screen = this.get_screen(), this.emit("add");
    return !0;
}, suit.Container.prototype.remove = function(a) {
    suit.ensure(a, suit.Widget);
    var b;
    if (b = this.index_of(a)) {
        this.children.splice(b, 1);
        return !0;
    }
    return !1;
}, suit.Container.prototype.remove_all = function() {
    for (var a = 0, b = this.children.length; a < b; a++) this.children[a].parent = null, this.children[a].screen = null;
    this.children = [];
}, suit.Container.prototype.replace = function(a, b) {
    suit.ensure(a, [ suit.Widget, "number" ]), suit.ensure(b, suit.Widget);
    var c;
    typeof a == "number" ? c = a : c = this.index_of(a);
    if (c >= this.children.length) return this.add(b);
    b.parent = this, b.screen = this.get_screen(), this.children[c] = b;
    return !0;
}, suit.Container.prototype.insert = function(a, b) {
    suit.ensure(a, "number"), suit.ensure(b, suit.Widget);
    if (a >= this.children.length) return this.add(b);
    b.parent = this, b.screen = this.get_screen(), this.children.splice(a, 0, b);
    return !0;
}, suit.Container.prototype.get_child_with_coords = function(a, b) {
    suit.ensure(a, "number"), suit.ensure(b, "number");
    if (!this.children.length) return !1;
    var c;
    for (var d = 0, e = this.children.length; d < e; d++) {
        c = this.children[d];
        if (!c.allocation) continue;
        if (a >= c.allocation.x && a <= c.allocation.x + c.allocation.width && b >= c.allocation.y && b <= c.allocation.y + c.allocation.height) return c;
    }
    return !1;
}, suit.Bin = function() {
    suit.Container.call(this), this.child = null;
}, suit.Bin.prototype = suit.Container.inherit(), suit.Bin.prototype.name = "Bin", suit.Bin.prototype.set_child = function(a) {
    suit.ensure(a, suit.Widget), this.child ? suit.error("#%s already has child widget #%s.", this.name, this.child.name) : (this.child = a, suit.Container.prototype.add.call(this, a));
}, suit.Bin.prototype.get_child = function() {
    if (this.child) return this.child;
    return !1;
}, suit.Bin.prototype.clear_child = function() {
    this.child = null, this.remove_all();
}, suit.Bin.prototype.add = function() {
    suit.error("#%s is a Bin widget and can only hold one child, use set_child to add a child.", this.name);
    return !1;
}, suit.Bin.prototype.remove = function() {
    suit.error("#%s is a Bin widget; use clear_child to remove its child.", this.name);
    return !1;
}, suit.Bin.prototype.get_request_mode = function() {
    if (this.child) return this.child.get_request_mode();
    return SizeRequestMode.HEIGHT_FOR_WIDTH;
}, suit.Bin.prototype.get_preferred_width = function() {
    var a = this.style ? this.style.padding_left + this.style.padding_right : 0, b = {
        minimum: a,
        natural: a
    };
    if (this.child) {
        var c = this.child.get_preferred_width();
        b.minimum += c.minimum, b.natural += c.natural;
    }
    return b;
}, suit.Bin.prototype.get_preferred_height = function() {
    var a = this.style ? this.style.padding_top + this.style.padding_bottom : 0, b = {
        minimum: a,
        natural: a
    };
    if (this.child) {
        var c = this.child.get_preferred_height();
        b.minimum += c.minimum, b.natural += c.natural;
    }
    return b;
}, suit.Bin.prototype.get_preferred_width_for_height = function(a) {
    suit.ensure(a, "number");
    var b = this.style ? this.style.padding_left + this.style.padding_right : 0, c = {
        minimum: b,
        natural: b
    };
    if (this.child) {
        var d = this.child.get_preferred_width_for_height(a);
        c.minimum += d.minimum, c.natural += d.natural;
    }
    return c;
}, suit.Bin.prototype.get_preferred_height_for_width = function(a) {
    suit.ensure(a, "number");
    var b = this.style ? this.style.padding_top + this.style.padding_bottom : 0, c = {
        minimum: b,
        natural: b
    };
    if (this.child) {
        var d = this.child.get_preferred_height_for_width(a);
        c.minimum += d.minimum, c.natural += d.natural;
    }
    return c;
}, suit.ProgressBar = function(a) {
    suit.Bin.call(this), this.orientation = "horizontal", this.fraction = 0, a && (suit.ensure(a, "string"), this.set_child(new suit.Label(a)), this.child.set_align("center"), this.child.set_valign("middle")), this.style = {
        padding_top: 6,
        padding_bottom: 6,
        padding_left: 8,
        padding_right: 8
    };
}, suit.ProgressBar.prototype = suit.Bin.inherit(), suit.ProgressBar.prototype.name = "ProgressBar", suit.ProgressBar.prototype.draw = function(a) {
    suit.ensure(a, suit.Graphics);
    var b = this.allocation;
    a.set_fill_stroke("#191919"), a.rect(b.x, b.y, b.width, b.height), a.set_fill_stroke("#333333"), this.orientation === "horizontal" ? a.rect(b.x, b.y, b.width * this.fraction | 0, b.height) : a.rect(b.x, b.y, b.width, b.height * this.fraction | 0);
}, suit.ProgressBar.prototype.set_fraction = function(a) {
    suit.ensure(a, "number"), this.fraction = a, this.queue_redraw();
}, suit.ProgressBar.prototype.get_fraction = function() {
    return this.fraction;
}, suit.Scroller = function(a) {
    suit.Bin.call(this), this.scrollX = 0, this.scrollY = 0, this.event_mask = suit.Event.ButtonPress | suit.Event.ButtonRelease | suit.Event.Scroll, this.dragging = !1, this.startDragX = null, this.startDragY = null, this.policyX = "never", this.policyY = "always", a && (suit.ensure(a, suit.Widget), this.set_child(a)), this.connect("event_button", this.on_event_button), this.connect("event_scroll", this.on_event_scroll), this.connect("event_motion", this.on_event_motion), this.style = {
        padding_top: 5,
        padding_bottom: 5,
        padding_left: 8,
        padding_right: 8
    };
}, suit.Scroller.prototype = suit.Bin.inherit(), suit.Scroller.prototype.name = "Scroller", suit.Scroller.prototype.draw = function(a) {
    suit.ensure(a, suit.Graphics);
    var b = this.allocation;
    a.set_fill_stroke("#000"), a.rect(b.x, b.y, b.width, b.height), this.child && this.draw_scrollbars(a);
}, suit.Scroller.prototype.draw_scrollbars = function(a) {
    suit.ensure(a, suit.Graphics);
    var b = this.allocation, c = this.child.get_allocation();
    a.set_stroke_style(4, "round"), a.set_fill_stroke(null, "#333");
    if (this.policyY === "always") {
        var d = b.x + b.width - 5.5, e = 6 + b.y + -this.scrollY / c.height * b.height, f = b.height / c.height * (b.height - 12) - 12;
        a.path([ [ d, e ], [ d, e + f ] ]);
    }
    if (this.policyX === "always") {
        var e = b.y + b.height - 5.5, d = 6 + b.x + -this.scrollX / c.width * b.width, g = b.width / c.width * (b.width - 12) - 12;
        a.path([ [ d, e ], [ d + g, e ] ]);
    }
}, suit.Scroller.prototype.size_allocate = function(a) {
    suit.ensure(a, suit.Allocation), suit.Widget.prototype.size_allocate.call(this, a);
    var b, c;
    this.child && (this.policyX === "never" && this.policyY === "always" ? (b = a.width - this.style.padding_left - this.style.padding_right - 1, c = this.child.get_preferred_height_for_width(b).natural) : this.policyX === "never" && this.policyY === "never" ? (b = a.width - this.style.padding_left - this.style.padding_right - 1, c = a.height - this.style.padding_top - this.style.padding_bottom - 1) : this.policyX === "always" && this.policyY === "always" ? (b = this.child.get_preferred_width().natural, c = this.child.get_preferred_height().natural) : this.policyX === "always" && this.policyY === "never" && (c = a.height - this.style.padding_top - this.style.padding_bottom - 1, b = this.child.get_preferred_width_for_height(c).natural), this.child.size_allocate(new suit.Allocation(0, 0, b, c)), this.update_scroll_position());
}, suit.Scroller.prototype.update_scroll_position = function() {
    if (this.child) {
        var a = this.child.get_allocation(), b = this.get_allocation(), c = b.width - a.width - this.style.padding_left - this.style.padding_right, d = b.height - a.height - this.style.padding_bottom - this.style.padding_top;
        this.scrollX = this.scrollX > 0 ? 0 : this.scrollX < c ? c : this.scrollX, this.scrollY = this.scrollY > 0 ? 0 : this.scrollY < d ? d : this.scrollY, this.policyX === "never" && (this.scrollX = 0), this.policyY === "never" && (this.scrollY = 0), a.x = this.style.padding_left + this.scrollX, a.y = this.style.padding_top + this.scrollY, this.child.set_allocation(a), this.queue_redraw();
    }
}, suit.Scroller.prototype.set_policy = function(a, b) {
    suit.ensure(a, [ "string", "undefined" ]), suit.ensure(b, [ "string", "undefined" ]), this.policyX = a || "never", this.policyY = b || "always";
}, suit.Scroller.prototype.on_event_scroll = function(a) {
    a.deltaY && this.policyY === "always" && (this.scrollY += a.deltaY, this.update_scroll_position()), a.deltaX && this.policyX === "always" && (this.scrollX += a.deltaX, this.update_scroll_position());
}, suit.Scroller.prototype.on_event_button = function(a) {
    switch (a.type) {
      case suit.Event.ButtonPress:
        this.startDragX = a.x, this.startDragY = a.y, this.dragging = !0, this.event_mask_add(suit.Event.Motion), this.lock();
        break;
      case suit.Event.ButtonRelease:
        this.dragging && (this.dragging = !1, this.event_mask_sub(suit.Event.Motion), this.unlock());
    }
}, suit.Scroller.prototype.on_event_motion = function(a) {
    this.dragging && (this.policyY === "always" && (this.scrollY -= this.startDragY - a.y, this.startDragY = a.y), this.policyX === "always" && (this.scrollX -= this.startDragX - a.x, this.startDragX = a.x), this.update_scroll_position());
}, suit.Scroller.prototype.get_request_mode = function() {
    if (this.child) return this.child.get_request_mode();
    return SizeRequestMode.HEIGHT_FOR_WIDTH;
}, suit.Scroller.prototype.get_preferred_width = function() {
    var a = new RequestedSize(1, 1);
    this.child && (a = this.child.get_preferred_width());
    return a;
}, suit.Scroller.prototype.get_preferred_height = function() {
    var a = new suit.RequestedSize(1, 1);
    this.child && (a = this.child.get_preferred_height());
    return a;
}, suit.Scroller.prototype.get_preferred_width_for_height = function(a) {
    suit.ensure(a, "number");
    var b = new suit.RequestedSize(1, 1);
    this.child && (b = this.child.get_preferred_width_for_height());
    return b;
}, suit.Scroller.prototype.get_preferred_height_for_width = function(a) {
    suit.ensure(a, "number");
    var b = new suit.RequestedSize(1, 1);
    this.child && (b = this.child.get_preferred_height_for_width(a));
    return b;
}, suit.Button = function(a) {
    suit.Bin.call(this), this.event_mask = suit.Event.ButtonPress, this.pressed = !1, a && (suit.ensure(a, "string"), this.set_child(new suit.Label(a)), this.child.set_align("center"), this.child.set_valign("middle")), this.connect("event_button", this.on_event_button), this.style = {
        padding_top: 6,
        padding_bottom: 6,
        padding_left: 8,
        padding_right: 8
    };
}, suit.Button.prototype = suit.Bin.inherit(), suit.Button.prototype.name = "Button", suit.Button.prototype.draw = function(a) {
    suit.ensure(a, suit.Graphics);
    var b = this.allocation, c;
    this.pressed ? c = [ [ 0, "#2e2e2e" ], [ 1, "#3f3f3f" ] ] : c = [ [ 0, "#3f3f3f" ], [ 1, "#2e2e2e" ] ], a.set_fill_stroke(a.create_linear_gradient(b.x, b.y, b.x, b.y + b.height, c), "#575757"), a.rect(b.x, b.y, b.width, b.height), a.set_stroke_style(1, "butt", "miter"), a.path([ [ b.x, b.y + b.height - 1 ], [ b.x, b.y ], [ b.x + b.width - 1, b.y ], [ b.x + b.width - 1, b.y + b.height - 1 ] ]), a.set_fill_stroke("#ffffff", "#0b0b0b"), a.path([ [ b.x + b.width - 1, b.y + b.height - 1 ], [ b.x, b.y + b.height - 1 ] ]);
}, suit.Button.prototype.size_allocate = function(a) {
    suit.Widget.prototype.size_allocate.call(this, a), this.child && this.child.size_allocate(new suit.Allocation(this.style.padding_left, this.style.padding_top + this.pressed, a.width - this.style.padding_left - this.style.padding_right - 1, a.height - this.style.padding_top - this.style.padding_bottom - 1));
}, suit.Button.prototype.on_event_button = function(a) {
    switch (a.type) {
      case suit.Event.ButtonPress:
        this.pressed = !0, this.event_mask_add(suit.Event.ButtonRelease), this.lock(), this.size_allocate(this.allocation), this.queue_redraw();
        break;
      case suit.Event.ButtonRelease:
        this.pressed && (this.event_mask_sub(suit.Event.ButtonRelease), this.emit("activate"), this.pressed = !1, this.unlock(), this.size_allocate(this.allocation), this.queue_redraw());
    }
}, suit.Screen = function() {
    suit.Bin.call(this), this.update_timer = null, this.throttling = !1, this.lock = null, this.canvas = document.createElement("canvas"), this.context = new suit.Graphics(this.canvas.getContext("2d")), this.container = document.createElement("div"), this.container.style.position = "absolute", this.container.style.top = "0", this.container.style.left = "0", this.container.appendChild(this.canvas), document.body.style.overflow = "hidden", document.body.appendChild(this.container), this.resize(), this.attach_dom_events();
}, suit.Screen.prototype = suit.Bin.inherit(), suit.Screen.prototype.name = "Screen", suit.Screen.prototype.queue_redraw = function() {
    this.update_timer && clearTimeout(this.update_timer), this.throttling ? this.update_timer = setTimeout(this.draw.bind(this), 10) : this.draw();
}, suit.Screen.prototype.queue_resize = function() {
    this.resize();
}, suit.Screen.prototype.draw = function() {
    var a = this.context, b = this.allocation;
    a.save(), a.set_fill_stroke("#191919"), a.rect(0, 0, b.width, b.height), this.child && this.draw_recursive(this.child, a), a.restore();
}, suit.Screen.prototype.draw_recursive = function(a, b) {
    suit.ensure(a, suit.Widget), suit.ensure(b, suit.Graphics);
    var c = a.get_allocation();
    if (c) {
        b.push_clip.apply(b, c.args()), a.draw(b), b.cc.translate(c.x, c.y);
        if (a.children) for (var d = 0, e = a.children.length; d < e; d++) this.draw_recursive(a.children[d], b);
        b.pop_clip();
    }
}, suit.Screen.prototype.size_allocate = function(a) {
    suit.ensure(a, suit.Allocation), suit.Widget.prototype.size_allocate.call(this, a), this.container.style.width = a.width + "px", this.container.style.height = a.height + "px", this.canvas.width = a.width, this.canvas.height = a.height;
    var b = Math.min(600, a.width - 50), c = Math.min(400, a.height - 50);
    this.child && this.child.size_allocate(new suit.Allocation(a.width / 2 - b / 2, a.height / 2 - c / 2, b, c));
}, suit.Screen.prototype.resize = function() {
    var a = window.innerWidth, b = window.innerHeight;
    this.size_allocate(new suit.Allocation(0, 0, a, b)), this.draw(), suit.log("suit.Screen.RESIZE()");
}, suit.Screen.prototype.attach_dom_events = function() {
    var a = this.resize.bind(this), b = function(a) {
        var b = this.get_mouse_coordinates(a), c = this.lock || this.get_child_with_coords(b[0], b[1]);
        c && c.register_event(new suit.EventButton(suit.Event.ButtonPress, suit.Modifiers.None, this.get_button(a), b[0], b[1], -1)), a.stopPropagation(), a.preventDefault();
        return !1;
    }.bind(this), c = [ -1, -1 ], d = function(a) {
        var b = this.get_mouse_coordinates(a);
        if (b[0] !== c[0] || b[1] !== c[1]) {
            c = b;
            var d = this.lock || this.get_child_with_coords(b[0], b[1]);
            d && d.register_event(new suit.EventMotion(suit.Modifiers.None, b[0], b[1], -1)), a.stopPropagation(), a.preventDefault();
            return !1;
        }
    }.bind(this), e = function(a) {
        var b = this.get_mouse_coordinates(a), c = this.lock || this.get_child_with_coords(b[0], b[1]);
        c && c.register_event(new suit.EventButton(suit.Event.ButtonRelease, suit.Modifiers.None, this.get_button(a), b[0], b[1], -1)), a.stopPropagation(), a.preventDefault();
        return !1;
    }.bind(this), f = function(a) {
        var b = this.get_mouse_coordinates(a), c = this.lock || this.get_child_with_coords(b[0], b[1]), d = 0, e = 0;
        a.wheelDelta ? a.wheelDeltaX || a.wheelDeltaY ? (d = a.wheelDeltaX, e = a.wheelDeltaY) : e = a.wheelDelta : a.axis === a.HORIZONTAL_AXIS ? d = -a.detail : a.axis === a.VERTICAL_AXIS && (e = -a.detail);
        if (d === 0 && e === 0) return !1;
        c && c.register_event(new suit.EventScroll(suit.Modifiers.None, b[0], b[1], d, e, -1)), a.stopPropagation(), a.preventDefault();
        return !1;
    }.bind(this), g = function(a) {
        a.stopPropagation(), a.preventDefault();
        return !1;
    }, h = function(a) {
        var b = a.changedTouches;
        for (var c = 0, d = b.length; c < d; c++) {
            var e = this.get_mouse_coordinates(b[c]), f = this.lock || this.get_child_with_coords(e[0], e[1]);
            f && f.register_event(new suit.EventButton(suit.Event.ButtonPress, suit.Modifiers.None, this.get_button(b[c]), e[0], e[1], b[c].identifier));
        }
        a.stopPropagation(), a.preventDefault();
        return !1;
    }.bind(this), i = function(a) {
        var b = a.changedTouches;
        for (var c = 0, d = b.length; c < d; c++) {
            var e = this.get_mouse_coordinates(b[c]).reverse(), f = this.lock || this.get_child_with_coords(e[0], e[1]);
            f && f.register_event(new suit.EventMotion(suit.Modifiers.None, this.get_button(b[c]), e[0], e[1], b[c].identifier));
        }
        a.stopPropagation(), a.preventDefault();
        return !1;
    }.bind(this), j = function(a) {
        var b = a.changedTouches;
        for (var c = 0, d = b.length; c < d; c++) {
            var e = this.get_mouse_coordinates(b[c]), f = this.lock || this.get_child_with_coords(e[0], e[1]);
            f && f.register_event(new suit.EventButton(suit.Event.ButtonRelease, suit.Modifiers.None, this.get_button(b[c]), e[0], e[1], b[c].identifier));
        }
        a.stopPropagation(), a.preventDefault();
        return !1;
    }.bind(this);
    addEventListener("resize", a, !1), addEventListener("mousedown", b, !1), addEventListener("mouseup", e, !1), addEventListener("MozMousePixelScroll", f, !1), addEventListener("mousewheel", f, !1), addEventListener("mousemove", d, !1), addEventListener("contextmenu", g, !1), addEventListener("touchstart", h, !1), addEventListener("touchmove", i, !1), addEventListener("touchend", j, !1);
}, suit.Screen.prototype.get_button = function(a) {
    var b = !1;
    a.which ? rightclick = a.which == 3 : a.button && (rightclick = a.button == 2);
    return b ? 3 : 1;
}, suit.Screen.prototype.get_mouse_coordinates = function(a) {
    var b = 0, c = 0;
    a.pageX || a.pageY ? (b = a.pageX, c = a.pageY) : (b = a.clientX + document.body.scrollLeft + document.documentElement.scrollLeft, c = a.clientY + document.body.scrollTop + document.documentElement.scrollTop);
    return [ b, c ];
}, suit.Packer = function(a) {
    suit.ensure(a, "string"), suit.Container.call(this), this.orientation = a || "horizontal", this.align = "start", this.spacing = 20, this.style = {
        padding_top: 0,
        padding_bottom: 0,
        padding_left: 0,
        padding_right: 0
    };
}, suit.Packer.prototype = suit.Container.inherit(), suit.Packer.prototype.name = "Packer", suit.Packer.prototype.set_spacing = function(a) {
    suit.ensure(a, "number"), this.spacing = a, this.allocation && this.size_allocate(this.allocation);
}, suit.Packer.prototype.get_spacing = function() {
    return this.spacing;
}, suit.Packer.prototype.size_allocate = function(a) {
    suit.ensure(a, suit.Allocation), suit.Widget.prototype.size_allocate.call(this, a);
    var b, c;
    this.orientation === "horizontal" ? (b = this.orientation === "horizontal" ? a.width : a.height, c = this.orientation === "horizontal" ? a.height : a.width) : (b = this.orientation === "horizontal" ? a.height : a.width, c = this.orientation === "horizontal" ? a.width : a.height);
    var d = 0, e = [];
    for (var f = 0, g = this.children.length; f < g; f++) {
        var h = this.children[f], i = this.orientation === "horizontal" ? h.get_preferred_width_for_height(c).natural : h.get_preferred_height_for_width(b).natural;
        d += i, f !== 0 && (d += this.spacing), e.push(i);
    }
    var j = 0;
    for (var f = 0, g = this.children.length; f < g; f++) {
        var h = this.children[f], k;
        f !== 0 && (j += this.spacing), this.orientation === "horizontal" ? k = new suit.Allocation(j, 0, e[f], a.height) : k = new suit.Allocation(0, j, a.width, e[f]), h.size_allocate(k), j += e[f];
    }
}, suit.Packer.prototype.get_request_mode = function() {
    return SizeRequestMode.HEIGHT_FOR_WIDTH;
}, suit.Packer.prototype.get_preferred_width = function() {
    var a = 0, b = 0;
    for (var c = 0, d = this.children.length; c < d; c++) {
        var e = this.children[c], f = e.get_preferred_width();
        a += f.minimum, b += f.natural;
    }
    a += this.spacing * (d - 1), b += this.spacing * (d - 1);
    return {
        minimum: a,
        natural: b
    };
}, suit.Packer.prototype.get_preferred_height = function() {
    var a = 0, b = 0;
    for (var c = 0, d = this.children.length; c < d; c++) {
        var e = this.children[c], f = e.get_preferred_height();
        a += f.minimum, b += f.natural;
    }
    a += this.spacing * (d - 1), b += this.spacing * (d - 1);
    return {
        minimum: a,
        natural: b
    };
}, suit.Packer.prototype.get_preferred_width_for_height = function(a) {
    suit.ensure(a, "number");
    var b = 0, c = 0;
    if (this.orientation === "horizontal") {
        for (var d = 0, e = this.children.length; d < e; d++) {
            var f = this.children[d], g = f.get_preferred_width_for_height(a);
            b += g.minimum, c += g.natural;
        }
        b += this.spacing * (e - 1), c += this.spacing * (e - 1);
    } else for (var d = 0, e = this.children.length; d < e; d++) {
        var f = this.children[d], g = f.get_preferred_width_for_height(a);
        b = g.minimum > b ? g.minimum : b, c = g.natural > c ? g.natural : c;
    }
    return {
        minimum: b,
        natural: c
    };
}, suit.Packer.prototype.get_preferred_height_for_width = function(a) {
    suit.ensure(a, "number");
    var b = 0, c = 0;
    if (this.orientation === "horizontal") for (var d = 0, e = this.children.length; d < e; d++) {
        var f = this.children[d], g = f.get_preferred_height_for_width(a);
        b = g.minimum > b ? g.minimum : b, c = g.natural > c ? g.natural : c;
    } else {
        for (var d = 0, e = this.children.length; d < e; d++) {
            var f = this.children[d], g = f.get_preferred_height_for_width(a);
            b += g.minimum, c += g.natural;
        }
        b += this.spacing * (e - 1), c += this.spacing * (e - 1);
    }
    return {
        minimum: b,
        natural: c
    };
};