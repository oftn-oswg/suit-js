SUIT To-Do List
===============

The following is a list of features and bugs and ideas that need to be fixed or implemented, in addition to the many widgets that need to be added. When the item is complete, move the item to the bottom section labeled "Completed".

* Fix Firefox speed problems
* Fix text clipping issue and Firefox's alignment issue.
* Add `suit.Widget.prototype.clone()` so widgets can be cloned easy to have identical widgets in different places.
* Allow widgets to be set to expand in Packer, so that all available space can be used.
* Seperate themeing code from widget logic to a ThemeEngine class
* Rework drawing system to only draw what is necessary (only the widgets that called queue_redraw), and not being clipped.
* Make Label widgets selectable with set_selectable
* Create easy tooltip API (set_tooltip_text/get_tooltip_text)
* Create easy context menu API
* Allow widget focusing for keyboard events, with `<Tab>` to go to the next widget and `<Shift> + <Tab>` to go to the previous
* Allow all widgets to be insensitive
* Create interface designer and builder which uses JSON format to describe the layout and widgets of the entire screen


Widgets
-------

* CheckBox (similar to `<input type="checkbox"/>`)
* ColorSelection (will mimic GTK's color selection dialog format)
* ComboBox (similar to `<select>`)
* TextEntry (similar to `<input type="text"/>`)
* FileSelector (similar to `<input type="file"/>`)
* Frame (similar to a `<fieldset>` with `<legend>`)
* Image (similar to `<img>`, just displays an image)
* Spinner (animated icon used for notifying you when something is working)
* MenuBar & Menus (like File, Edit, View, Help, etc)
* Notebook (tabbed notebook container)
* Panes (Holds two children and allows user to distribute sizing between them)
* ProgressBar
* RadioButton
* Scales (horizontal or vertical slider widget for selecting a value from a range)
* Seperator (small widget used to visually seperate other widgets from each other)
* SpinButton (number input with up and down arrows to select value)
* StatusBar (widget that allows push/pop of children)
* Switch (light-switch style toggle)
* TextView (similar to `<textarea>`)


Completed
---------

* Make Allocation coordinates relative to parent widget, so they don't have to updated when parent's allocation changes.
* Rename set_allocation to size_allocate; seperate drawing from allocating
* Add `suit.Container.prototype.insert(widget, index)` and `suit.Container.prototype.replace(widget||index, widget)`
