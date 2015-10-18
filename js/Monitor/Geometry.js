Monitor.Geometry = Monitor.Class({
	id: null,
	width: 0,
	height:0,
	x: 0,
	y: 0,
	
	_left: 0,
	_top: 0,
	_right:0,
	_bottom:0,
	
	bounds: null,
	init: function(options) {
		Monitor.Util.extend(this, options);
	},
	
	draw: function(renderer) {
		renderer.setOrigin(this.x, this.y);
	},
	
	isPointInRange: function(x, y) {
		return x > this.bounds.left
			&& x < this.bounds.left + this.bounds.width
			&& y > this.bounds.top
			&& y < this.bounds.top + this.bounds.height;
	},
	
	isBoundsInRange: function(range) {
		return this.isPointInRange(range.left, range.top)
			|| this.isPointInRange(range.left + range.width, range.top)
			|| this.isPointInRange(range.left + range.width, range.top + range.height)
			|| this.isPointInRange(range.left, range.top + range.height);
	},
	
	move: function(x, y) {
		this.x += x;
		this.y += y;
	},
	
	getBounds: function() {
		if(!this.bounds) {
			this.bounds = {};
		}
		this.bounds.left = this.x-this._left;
		this.bounds.top = this.y-this._top;
		this.bounds.width = this.width+this._right + this._left;
		this.bounds.height = this.height+this._bottom+this._top;
		return this.bounds;
	},
	
	CLASS_NAME: "Monitor.Geometry"
});