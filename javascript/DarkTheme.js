var DarkTheme = {
	render_button: function(widget, allocation) {
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 2;
		context.shadowBlur = 3;
		context.shadowColor = "black";
		//Create a blank white box to apply the shadow.
		//Safari 4 doesn't support shadows on objects with gradients
		context.fillStyle = "black";
		context.fillRect(alocation.x, allocation.y, allocation.width, allocation.height);
	}
};
