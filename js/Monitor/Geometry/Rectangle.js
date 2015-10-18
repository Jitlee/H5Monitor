Monitor.Geometry.Rectangle = Monitor.Class(Monitor.Geometry, {
	pen:null,
	init: function(options) {
		Monitor.Geometry.prototype.init.apply(this, arguments);
	},
	
	draw: function(renderer) {
		Monitor.Geometry.prototype.draw.apply(this, arguments);
		renderer.drawRectangle(this.pen, 0, 0, this.width, this.height);
		this._left = this._top = this._right = this._bottom = Math.round(this.pen.strokeThickness / 2.0);
		this.getBounds();
	},
	
	CLASS_NAME: "Monitor.Geometry.Rectangle"
});