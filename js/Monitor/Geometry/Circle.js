Monitor.Geometry.Circle = Monitor.Class(Monitor.Geometry, {
	pen:null,
	init: function(options) {
		Monitor.Geometry.prototype.init.apply(this, arguments);
	},
	
	draw: function(renderer) {
		Monitor.Geometry.prototype.draw.apply(this, arguments);
		renderer.drawCircle(this.pen, this.width*0.5, this.height*0.5, this.width*0.5);
		this.getBounds();
	},
	
	isPointInRange: function(x, y) {
		var r = this.width*0.5;
		var x1 = this.x + this.width*0.5;
		var y1 = this.y + this.height*0.5;
		return (x1 - x)*(x1 - x) + (y1 - y) * (y1 - y)< r*r;
	},
	
	CLASS_NAME: "Monitor.Geometry.Circle"
});