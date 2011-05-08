suit.Grid = function() {
	suit.Container.call(this);
	
	this.row_homogenous = false;
	this.row_spacing = 0;
	
	this.column_homogenous = false;
	this.column_spacing = 0;
};

suit.Grid.prototype = suit.Container.inherit();
suit.Grid.prototype.name = "Grid";

suit.Grid.prototype.attach = function(child, column, row, rowspan, colspan) {
};

suit.Grid.prototype.set_row_homogenous = function(homogenous) {
	this.row_homogenous = homogenous;
	this.queue_redraw();
};

suit.Grid.prototype.get_row_homogenous = function(homogenous) {
	return this.row_homogenous;
};

suit.Grid.prototype.set_row_spacing = function(spacing) {
	this.row_spacing = spacing;
	this.queue_redraw();
};

suit.Grid.prototype.get_row_spacing = function() {
	return this.row_spacing;
};

suit.Grid.prototype.set_column_homogenous = function(homogenous) {
	this.column_homogenous = homogenous;
	this.queue_redraw();
};

suit.Grid.prototype.get_column_homogenous = function(homogenous) {
	return this.column_homogenous;
};

suit.Grid.prototype.set_column_spacing = function(spacing) {
	this.column_spacing = spacing;
	this.queue_redraw();
};

suit.Grid.prototype.get_column_spacing = function() {
	return this.column_spacing;
};
